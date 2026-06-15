/**
 * Small, dependency-free file cache and fetch helpers for the ingestion
 * scripts. Caching keeps repeated runs from hammering public APIs; raw
 * responses are written verbatim under data/raw for transparency.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const ROOT = resolve(HERE, "..");
export const CACHE_DIR = resolve(ROOT, "data/cache");
export const RAW_DIR = resolve(ROOT, "data/raw");

/** Default cache lifetime: 24 hours. */
export const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24;

export function ensureDir(dir: string): void {
  mkdirSync(dir, { recursive: true });
}

export function readJsonFile<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function cacheKey(url: string): string {
  return createHash("sha256").update(url).digest("hex").slice(0, 32);
}

interface CacheEntry<T> {
  url: string;
  fetchedAt: string;
  data: T;
}

export function readCache<T>(url: string, ttlMs: number): T | null {
  const file = resolve(CACHE_DIR, `${cacheKey(url)}.json`);
  if (!existsSync(file)) return null;
  try {
    const entry = JSON.parse(readFileSync(file, "utf8")) as CacheEntry<T>;
    if (Date.now() - Date.parse(entry.fetchedAt) > ttlMs) return null;
    return entry.data;
  } catch {
    return null;
  }
}

export function writeCache<T>(url: string, data: T): void {
  ensureDir(CACHE_DIR);
  const file = resolve(CACHE_DIR, `${cacheKey(url)}.json`);
  const entry: CacheEntry<T> = { url, fetchedAt: new Date().toISOString(), data };
  writeFileSync(file, JSON.stringify(entry, null, 2));
}

export interface FetchOptions {
  ttlMs?: number;
  headers?: Record<string, string>;
  label?: string;
}

/**
 * Fetch JSON with a transparent file cache. Returns null (and warns) on any
 * non-2xx response or network error, so callers degrade gracefully rather than
 * throwing mid-run.
 */
export async function cachedFetchJson<T>(url: string, options: FetchOptions = {}): Promise<T | null> {
  const ttl = options.ttlMs ?? DEFAULT_TTL_MS;
  const cached = readCache<T>(url, ttl);
  if (cached !== null) return cached;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "adjacent-atlas-ingest (+https://github.com/Biswajit1999/adjacent-atlas)", ...options.headers },
    });
    if (!res.ok) {
      console.warn(`  ! ${options.label ?? "request"} failed: HTTP ${res.status}`);
      return null;
    }
    const data = (await res.json()) as T;
    writeCache(url, data);
    return data;
  } catch (err) {
    console.warn(`  ! ${options.label ?? "request"} error: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

/** Write a raw API record under data/raw/<subdir>/<name>.json for attribution. */
export function writeRaw(subdir: string, name: string, data: unknown): string {
  const dir = resolve(RAW_DIR, subdir);
  ensureDir(dir);
  const file = resolve(dir, `${name}.json`);
  writeFileSync(file, JSON.stringify(data, null, 2));
  return file;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
