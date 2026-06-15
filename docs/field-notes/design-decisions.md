# Field notes — design decisions

Why the project is built the way it is. These are choices, with their trade-offs,
not claims of best practice.

## The engine is the contract

Scoring, graph, layout, and synthesis live in a framework-agnostic package
(`packages/engine`) with no React or DOM dependency. The same code runs in the
build script (Node), the web server (Node), and the layout Web Worker (browser).
The JSON Schemas in `data/schemas` mirror the engine's types. The cost is a
monorepo with a build order; the benefit is that the part that has to be correct
— the scoring — can be tested and reasoned about on its own.

## A heuristic, not a model

The adjacency score is a weighted mean of five interpretable components. There is
no training, no embedding, no opaque step. This is a deliberate ceiling on
ambition: a trained model might rank better, but I could not hand you a one-line
explanation of why a node sits where it does, and that explanation is the point.

## Three.js directly, no react-three-fiber

The atlas owns its WebGL context, render loop, and disposal explicitly. That is
more code than a declarative wrapper, but it makes resource lifetime obvious —
every geometry, material, and texture is disposed on unmount — and keeps the
hot path free of reconciliation.

## Dark, read-closely interface

The interface is built to be read, not skimmed. Colour carries information (node
kind), size carries the score, and motion is restrained to a slow idle rotation
and a single selection pulse, both of which yield to `prefers-reduced-motion`.
The reference is an instrument console, not a dashboard.

## Honest fallbacks

When there is no ingested data, the app builds from a labelled seed; when Web
Workers are unavailable, layout runs synchronously; when WebGL is missing, the
ranked list carries the same data. None of these are hidden.
