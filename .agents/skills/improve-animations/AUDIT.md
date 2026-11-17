# Animation Audit Rules (Emil Kowalski Philosophy)

## 1. Purpose & Frequency
- **High-frequency UI (<150ms or instant)**: Actions triggered repeatedly or via keyboard shortcuts (dropdown selection, command palette, tabs, list hovers) must feel instant. Never block user intent with animations.
- **Medium-frequency UI (150ms–250ms)**: Modals, slide-overs, drawer menus, tooltips, toasts.
- **Low-frequency / Onboarding UI (250ms–400ms)**: Celebratory moments, onboarding cards, page transitions.
- **No animation on high-frequency keyboard operations**: Pressing Escape, Cmd+K, Arrow keys should respond instantly.

## 2. Easing & Duration
- **Never use `ease-in` for UI entrance**: `ease-in` starts slow and ends fast, making dropdowns, menus, and popovers feel sluggish and laggy.
- **Entrance**: Use fast deceleration / `ease-out` (e.g. `cubic-bezier(0.16, 1, 0.3, 1)` or `cubic-bezier(0, 0, 0.2, 1)`).
- **Exit**: Keep exits faster than entrances (typically 100ms–150ms) using `ease-in` or quick `ease-out`.
- **Between screen states**: Use `ease-in-out` (e.g. `cubic-bezier(0.4, 0, 0.2, 1)`) or a smooth spring.
- **Springs**: Preferred for interactive and interruptible elements:
  - Snappy UI: `{ stiffness: 400, damping: 30 }` or `{ bounce: 0, duration: 0.2 }`
  - Gentle UI: `{ stiffness: 250, damping: 25 }`
  - Avoid bouncy/overshoot springs on utility/data-heavy components.

## 3. Physicality & Origin
- **`transform-origin` must match context**:
  - Dropdowns & popovers: Origin must align with trigger button (e.g., `origin-top-left`, `origin-top-right`).
  - Dialog / Modal: `origin-center` or originate from the clicked card/button.
  - Floating action buttons: Scale outward from trigger point.
- **Avoid `scale(0)`**:
  - Never scale an element from `0` to `1`. It looks synthetic and causes blurry subpixel text rasterization.
  - Scale from `0.95` or `0.9` to `1` combined with opacity `0` to `1`.

## 4. Interruptibility
- **State reversal without jumps**: If a user hovers on and quickly off, the transition must smoothly reverse from the current position rather than snapping or completing the full forward animation.
- **Framer Motion / Spring dominance**: Prefer springs or velocity-preserving gestures for elements that can be interrupted by clicks, drags, or hover toggles.

## 5. Performance
- **Compositor-only properties**: Only animate `transform` and `opacity`.
- **Never animate layout reflow properties**: Avoid animating `height`, `width`, `top`, `left`, `margin`, `padding` directly with CSS transitions. Use `scale`, `translate`, or FLIP (`layout` in Framer Motion).
- **Will-Change**: Use `will-change: transform, opacity` sparingly and clean up when not animating.

## 6. Accessibility (Reduced Motion)
- **Honor `prefers-reduced-motion`**:
  - Replace large spatial translations/scales with simple opacity crossfades.
  - Tailwind: Utilize `motion-reduce:transition-none` or `motion-reduce:animate-none` where appropriate.
  - Framer Motion: Use `useReducedMotion()`.

## 7. Cohesion & Tokens
- **Centralize motion scales**: Avoid arbitrary durations (`duration-[320ms]`, `duration-[450ms]`) and arbitrary easings scattered in JSX.
- Reuse tokenized variables (e.g., `--ease-out-quad`, `--duration-fast`).
- Keep motion personality consistent (crisp & utilitarian vs. soft & playful).

## 8. Missed Opportunities
- Missing shared element transitions (`layoutId` for tabs, segmented controls, or filter pills).
- Missing layout animations on expanding cards or filter results.
- Jarring instantaneous swaps where a 120ms fade would provide continuity.
