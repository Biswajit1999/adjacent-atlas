"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { AtlasEdge, AtlasNode, NodeScore } from "@adjacent-atlas/engine";
import type { LayoutPosition } from "@/lib/layout";
import { KIND_VISUALS, FALLBACK_KIND_VISUAL } from "@/lib/format";

const WORLD_RADIUS = 60;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 2000;
const DEFAULT_DISTANCE = 165;
const MIN_DISTANCE = 85;
const MAX_DISTANCE = 340;

export interface AtlasSceneProps {
  nodes: AtlasNode[];
  edges: AtlasEdge[];
  scoreById: Record<string, NodeScore>;
  positions: LayoutPosition[] | null;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onHover?: (id: string | null) => void;
  visibleIds?: ReadonlySet<string> | null;
  height?: number;
  autoRotate?: boolean;
}

const VERTEX_SHADER = `
uniform float uPixelRatio;
attribute float aSize;
attribute float aAlpha;
attribute vec3 aColor;
varying float vAlpha;
varying vec3 vColor;
void main() {
  vAlpha = aAlpha;
  vColor = aColor;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float size = aSize * uPixelRatio * (250.0 / -mv.z);
  gl_PointSize = clamp(size, 1.5, 64.0);
  gl_Position = projectionMatrix * mv;
}
`;

const FRAGMENT_SHADER = `
varying float vAlpha;
varying vec3 vColor;
void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float d = length(uv);
  if (d > 0.5) discard;
  float core = smoothstep(0.5, 0.0, d);
  float a = vAlpha * pow(core, 1.8);
  gl_FragColor = vec4(vColor, a);
}
`;

interface SceneState {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  group: THREE.Group;
  pointMaterial: THREE.ShaderMaterial;
  lineMaterial: THREE.LineBasicMaterial;
  haloTexture: THREE.Texture;
  selectSprite: THREE.Sprite;
  hoverSprite: THREE.Sprite;
  raycaster: THREE.Raycaster;
  clock: THREE.Clock;
  points: THREE.Points | null;
  lines: THREE.LineSegments | null;
  pointGeometry: THREE.BufferGeometry | null;
  lineGeometry: THREE.BufferGeometry | null;
  basePositions: Float32Array | null;
  baseAlpha: Float32Array | null;
  colorHex: string[];
  indexToId: string[];
  idToIndex: Map<string, number>;
  pointer: { x: number; y: number; inside: boolean };
  dragging: boolean;
  last: { x: number; y: number };
  moved: number;
  hoveredId: string | null;
  raf: number;
  autoRotate: boolean;
  reducedMotion: boolean;
}

function makeHaloTexture(): THREE.Texture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0.0, "rgba(255,255,255,0)");
    g.addColorStop(0.45, "rgba(255,255,255,0)");
    g.addColorStop(0.62, "rgba(255,255,255,0.9)");
    g.addColorStop(0.78, "rgba(255,255,255,0.25)");
    g.addColorStop(1.0, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function disposeGraphObjects(state: SceneState): void {
  if (state.points) {
    state.group.remove(state.points);
    state.points = null;
  }
  if (state.lines) {
    state.group.remove(state.lines);
    state.lines = null;
  }
  state.pointGeometry?.dispose();
  state.lineGeometry?.dispose();
  state.pointGeometry = null;
  state.lineGeometry = null;
}

function buildGraphObjects(state: SceneState, props: AtlasSceneProps): void {
  disposeGraphObjects(state);
  const positions = props.positions;
  if (!positions) return;

  const posById = new Map(positions.map((p) => [p.id, p]));
  const nodes = props.nodes;
  const n = nodes.length;

  const pos = new Float32Array(n * 3);
  const col = new Float32Array(n * 3);
  const aSize = new Float32Array(n);
  const aAlpha = new Float32Array(n);
  const colorHex: string[] = new Array(n);
  const indexToId: string[] = new Array(n);
  const idToIndex = new Map<string, number>();
  const tmp = new THREE.Color();

  for (let i = 0; i < n; i += 1) {
    const node = nodes[i];
    const p = posById.get(node.id);
    const x = (p?.x ?? 0) * WORLD_RADIUS;
    const y = (p?.y ?? 0) * WORLD_RADIUS;
    const z = (p?.z ?? 0) * WORLD_RADIUS;
    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;

    const visual = KIND_VISUALS[node.kind] ?? FALLBACK_KIND_VISUAL;
    tmp.set(visual.color);
    col[i * 3] = tmp.r;
    col[i * 3 + 1] = tmp.g;
    col[i * 3 + 2] = tmp.b;
    colorHex[i] = visual.color;

    const adjacency = props.scoreById[node.id]?.adjacency ?? 0;
    aSize[i] = 5 + (adjacency / 100) * 11;
    aAlpha[i] = 0.35 + (adjacency / 100) * 0.6;

    indexToId[i] = node.id;
    idToIndex.set(node.id, i);
  }

  const pointGeometry = new THREE.BufferGeometry();
  pointGeometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  pointGeometry.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
  pointGeometry.setAttribute("aSize", new THREE.BufferAttribute(aSize, 1));
  pointGeometry.setAttribute("aAlpha", new THREE.BufferAttribute(aAlpha, 1));

  const points = new THREE.Points(pointGeometry, state.pointMaterial);
  points.frustumCulled = false;
  state.group.add(points);

  const segments: number[] = [];
  for (const edge of props.edges) {
    const a = posById.get(edge.source);
    const b = posById.get(edge.target);
    if (!a || !b) continue;
    segments.push(
      a.x * WORLD_RADIUS, a.y * WORLD_RADIUS, a.z * WORLD_RADIUS,
      b.x * WORLD_RADIUS, b.y * WORLD_RADIUS, b.z * WORLD_RADIUS,
    );
  }
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(segments, 3));
  const lines = new THREE.LineSegments(lineGeometry, state.lineMaterial);
  lines.frustumCulled = false;
  state.group.add(lines);

  state.points = points;
  state.lines = lines;
  state.pointGeometry = pointGeometry;
  state.lineGeometry = lineGeometry;
  state.basePositions = pos;
  state.baseAlpha = aAlpha.slice();
  state.colorHex = colorHex;
  state.indexToId = indexToId;
  state.idToIndex = idToIndex;

  applyVisibility(state, props.visibleIds ?? null);
  updateSelection(state, props.selectedId);
}

function applyVisibility(state: SceneState, visible: ReadonlySet<string> | null): void {
  if (!state.pointGeometry || !state.baseAlpha) return;
  const attr = state.pointGeometry.getAttribute("aAlpha") as THREE.BufferAttribute;
  const arr = attr.array as Float32Array;
  for (let i = 0; i < arr.length; i += 1) {
    const id = state.indexToId[i];
    const base = state.baseAlpha[i];
    arr[i] = !visible || visible.has(id) ? base : base * 0.08;
  }
  attr.needsUpdate = true;
}

function placeSprite(state: SceneState, sprite: THREE.Sprite, id: string | null, baseScale: number): void {
  if (!id || !state.basePositions) {
    sprite.visible = false;
    return;
  }
  const i = state.idToIndex.get(id);
  if (i === undefined) {
    sprite.visible = false;
    return;
  }
  sprite.position.set(
    state.basePositions[i * 3],
    state.basePositions[i * 3 + 1],
    state.basePositions[i * 3 + 2],
  );
  sprite.material.color.set(state.colorHex[i] ?? "#ffffff");
  sprite.scale.set(baseScale, baseScale, 1);
  sprite.visible = true;
}

function updateSelection(state: SceneState, id: string | null): void {
  placeSprite(state, state.selectSprite, id, 13);
}

function updateHover(state: SceneState, id: string | null): void {
  placeSprite(state, state.hoverSprite, id, 10);
}

function pick(state: SceneState, visible: ReadonlySet<string> | null): string | null {
  if (!state.points) return null;
  state.raycaster.setFromCamera(new THREE.Vector2(state.pointer.x, state.pointer.y), state.camera);
  state.raycaster.params.Points = { threshold: Math.max(3, state.camera.position.z * 0.03) };
  const hits = state.raycaster.intersectObject(state.points, false);
  for (const hit of hits) {
    const idx = hit.index;
    if (idx === undefined) continue;
    const id = state.indexToId[idx];
    if (!id) continue;
    if (visible && !visible.has(id)) continue;
    return id;
  }
  return null;
}

export function AtlasScene(props: AtlasSceneProps): JSX.Element {
  const { positions, selectedId, visibleIds, height = 520 } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef<SceneState | null>(null);
  const propsRef = useRef(props);
  propsRef.current = props;
  const [ready, setReady] = useState(false);
  const [glError, setGlError] = useState<string | null>(null);

  // One-time scene setup.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setGlError("WebGL is unavailable in this browser. The ranked list below has the same data.");
      return;
    }

    const width = container.clientWidth || 640;
    const initialHeight = propsRef.current.height ?? 520;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, initialHeight, false);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.cursor = "grab";
    renderer.domElement.style.touchAction = "none";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / initialHeight, CAMERA_NEAR, CAMERA_FAR);
    camera.position.set(0, 0, DEFAULT_DISTANCE);

    const group = new THREE.Group();
    group.rotation.x = -0.15;
    scene.add(group);

    const pointMaterial = new THREE.ShaderMaterial({
      uniforms: { uPixelRatio: { value: pixelRatio } },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending,
    });

    const lineMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color("#2c7a73"),
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
    });

    const haloTexture = makeHaloTexture();
    const makeSprite = (opacity: number): THREE.Sprite => {
      const material = new THREE.SpriteMaterial({
        map: haloTexture,
        color: new THREE.Color("#ffffff"),
        transparent: true,
        opacity,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const sprite = new THREE.Sprite(material);
      sprite.visible = false;
      sprite.renderOrder = 10;
      return sprite;
    };
    const selectSprite = makeSprite(0.9);
    const hoverSprite = makeSprite(0.5);
    group.add(selectSprite);
    group.add(hoverSprite);

    const prefersReducedMotion =
      typeof window !== "undefined" && typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;

    const state: SceneState = {
      renderer,
      scene,
      camera,
      group,
      pointMaterial,
      lineMaterial,
      haloTexture,
      selectSprite,
      hoverSprite,
      raycaster: new THREE.Raycaster(),
      clock: new THREE.Clock(),
      points: null,
      lines: null,
      pointGeometry: null,
      lineGeometry: null,
      basePositions: null,
      baseAlpha: null,
      colorHex: [],
      indexToId: [],
      idToIndex: new Map(),
      pointer: { x: 0, y: 0, inside: false },
      dragging: false,
      last: { x: 0, y: 0 },
      moved: 0,
      hoveredId: null,
      raf: 0,
      autoRotate: (propsRef.current.autoRotate ?? true) && !prefersReducedMotion,
      reducedMotion: prefersReducedMotion,
    };
    stateRef.current = state;

    const dom = renderer.domElement;
    const listeners = new AbortController();
    const signal = listeners.signal;

    const updatePointer = (clientX: number, clientY: number): void => {
      const rect = dom.getBoundingClientRect();
      state.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      state.pointer.y = -(((clientY - rect.top) / rect.height) * 2 - 1);
      state.pointer.inside = true;
    };

    dom.addEventListener(
      "pointerdown",
      (e: PointerEvent) => {
        state.dragging = true;
        state.moved = 0;
        state.last = { x: e.clientX, y: e.clientY };
        dom.style.cursor = "grabbing";
        dom.setPointerCapture(e.pointerId);
      },
      { signal },
    );

    dom.addEventListener(
      "pointermove",
      (e: PointerEvent) => {
        updatePointer(e.clientX, e.clientY);
        if (!state.dragging) return;
        const dx = e.clientX - state.last.x;
        const dy = e.clientY - state.last.y;
        state.last = { x: e.clientX, y: e.clientY };
        state.moved += Math.abs(dx) + Math.abs(dy);
        state.group.rotation.y += dx * 0.005;
        state.group.rotation.x = Math.max(-1.2, Math.min(1.2, state.group.rotation.x + dy * 0.005));
      },
      { signal },
    );

    const endDrag = (e: PointerEvent): void => {
      if (!state.dragging) return;
      state.dragging = false;
      dom.style.cursor = "grab";
      if (dom.hasPointerCapture(e.pointerId)) dom.releasePointerCapture(e.pointerId);
      if (state.moved < 5) {
        updatePointer(e.clientX, e.clientY);
        const id = pick(state, propsRef.current.visibleIds ?? null);
        propsRef.current.onSelect(id);
      }
    };
    dom.addEventListener("pointerup", endDrag, { signal });

    dom.addEventListener(
      "pointerleave",
      () => {
        state.pointer.inside = false;
        if (state.hoveredId !== null) {
          state.hoveredId = null;
          updateHover(state, null);
          propsRef.current.onHover?.(null);
        }
        dom.style.cursor = "grab";
      },
      { signal },
    );

    dom.addEventListener(
      "wheel",
      (e: WheelEvent) => {
        e.preventDefault();
        const next = state.camera.position.z + e.deltaY * 0.12;
        state.camera.position.z = Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, next));
      },
      { passive: false, signal },
    );

    // Keep the WebGL context recoverable instead of letting the browser drop it
    // permanently; preventing the default on contextlost allows restoration.
    dom.addEventListener(
      "webglcontextlost",
      (e) => {
        e.preventDefault();
      },
      { signal },
    );

    const resizeObserver = new ResizeObserver(() => {
      const w = container.clientWidth || 640;
      const h = propsRef.current.height ?? 520;
      state.renderer.setSize(w, h, false);
      state.camera.aspect = w / h;
      state.camera.updateProjectionMatrix();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.renderer.setPixelRatio(dpr);
      state.pointMaterial.uniforms.uPixelRatio.value = dpr;
    });
    resizeObserver.observe(container);

    const animate = (): void => {
      state.raf = requestAnimationFrame(animate);

      if (state.autoRotate && !state.dragging) {
        state.group.rotation.y += 0.0012;
      }

      if (state.pointer.inside && state.points) {
        const id = pick(state, propsRef.current.visibleIds ?? null);
        if (id !== state.hoveredId) {
          state.hoveredId = id;
          updateHover(state, id);
          propsRef.current.onHover?.(id);
          dom.style.cursor = id ? "pointer" : state.dragging ? "grabbing" : "grab";
        }
      }

      if (state.selectSprite.visible && !state.reducedMotion) {
        const t = state.clock.getElapsedTime();
        const s = 13 + Math.sin(t * 2.2) * 1.4;
        state.selectSprite.scale.set(s, s, 1);
      }

      state.renderer.render(state.scene, state.camera);
    };
    animate();

    setReady(true);

    return () => {
      cancelAnimationFrame(state.raf);
      listeners.abort();
      resizeObserver.disconnect();
      disposeGraphObjects(state);
      state.pointMaterial.dispose();
      state.lineMaterial.dispose();
      state.selectSprite.material.dispose();
      state.hoverSprite.material.dispose();
      state.haloTexture.dispose();
      state.renderer.dispose();
      if (dom.parentNode) dom.parentNode.removeChild(dom);
      stateRef.current = null;
      setReady(false);
    };
    // Setup runs once; live values are read through propsRef.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rebuild geometry when the graph or its layout changes.
  useEffect(() => {
    const state = stateRef.current;
    if (!ready || !state) return;
    buildGraphObjects(state, propsRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, positions, props.nodes, props.edges, props.scoreById]);

  // Update node visibility when filters change.
  useEffect(() => {
    const state = stateRef.current;
    if (!ready || !state) return;
    applyVisibility(state, visibleIds ?? null);
  }, [ready, visibleIds]);

  // Move the selection halo when the selected node changes.
  useEffect(() => {
    const state = stateRef.current;
    if (!ready || !state) return;
    updateSelection(state, selectedId);
  }, [ready, selectedId, positions]);

  return (
    <div className="scene" style={{ height }}>
      <div ref={containerRef} className="scene__canvas" style={{ height }} />
      {glError ? (
        <div className="scene__overlay">
          <span className="scene__hint">{glError}</span>
        </div>
      ) : null}
      {!glError && !positions ? (
        <div className="scene__overlay">
          <span className="scene__spinner" aria-hidden="true" />
          <span className="scene__hint">Computing layout…</span>
        </div>
      ) : null}
    </div>
  );
}
