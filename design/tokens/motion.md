# Motion

Motion should signal life and responsiveness without demanding attention.

## Durations

| Token | Value  | Use                          |
| ----- | ------ | ---------------------------- |
| fast  | 120ms  | Hover/border transitions     |
| base  | 220ms  | Most UI transitions          |
| slow  | 480ms  | Larger entrances             |

Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)`.

## Scene motion

- **Idle rotation:** ~0.0012 rad/frame on the node group, paused while dragging.
- **Selection pulse:** the selection halo scales by ±1.4 units at ~2.2 rad/s.
- **Hover:** halo appears immediately; no easing needed at this size.

## Restraint

No parallax, no auto-playing camera fly-throughs, no spring overshoot on UI
elements. The spinner is the only continuous UI animation, and only while data
or layout is pending.
