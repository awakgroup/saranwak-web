# Motion Implementation Plan

- **Plan Number**: `<NNN>`
- **Title**: `<Brief descriptive title>`
- **Severity**: `<HIGH | MEDIUM | LOW>`
- **Category**: `<Category from AUDIT.md>`
- **Target File(s)**: `<Absolute or workspace relative file paths>`
- **Commit**: `<Git rev-parse --short HEAD>`
- **Status**: `PROPOSED`

---

## 1. Problem Statement
`<Describe the motion deficiency: what feels sluggish, unnatural, jerky, or inconsistent, citing current file:line>`

```tsx
// Current implementation excerpt
```

---

## 2. Motion Specification
- **Property to animate**: `transform`, `opacity`
- **Duration**: `<e.g. 180ms>`
- **Easing / Spring**: `<e.g. cubic-bezier(0.16, 1, 0.3, 1) or { stiffness: 400, damping: 30 }>`
- **Transform Origin**: `<e.g. top right>`
- **Initial State**: `<e.g. opacity: 0, scale: 0.95>`
- **Final State**: `<e.g. opacity: 1, scale: 1>`
- **Reduced Motion Fallback**: `<e.g. opacity fade only>`

---

## 3. Step-by-Step Code Instructions
1. Open `<file_path>` at line `<line_number>`.
2. Replace:
```tsx
// Before
```
with:
```tsx
// After
```

---

## 4. Verification & Feel-Check
- [ ] **Frame inspection**: Check in browser DevTools Animations tab at 25% speed.
- [ ] **Interruptibility check**: Trigger the interaction and cancel mid-way; verify there is no jump.
- [ ] **Reduced motion**: Toggle `prefers-reduced-motion: reduce` in DevTools rendering tab and verify clean fallback.
- [ ] **Performance check**: Ensure no layout recalculations or paint flashes occur during motion.
