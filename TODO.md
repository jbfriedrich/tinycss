# TODO — tinycss

The big one, **OKLCH migration**, is **done** (2026-07-23). The colour system is now
OKLCH-native; see [`Colors.md`](Colors.md) for the full design rationale. What remains:

## Shadows

The shadow scale (`--shadow-s/m/l`) uses fixed `rgba()` layers. Consider a hybrid
system with separate, themeable shadow-colour variables so dark mode can deepen them:

```css
:root {
  --shadow-highlight: rgba(255,255,255,.3);
  --shadow-dark: rgba(0,0,0,.3);
  --shadow-soft: rgba(0,0,0,.15);
  --shadow-s: inset 0 1px 2px var(--shadow-highlight),
              0 1px 2px var(--shadow-dark),
              0 2px 4px var(--shadow-soft);
}
:root[data-theme=dark] {
  --shadow-highlight: rgba(255,255,255,.15);
  --shadow-dark: rgba(0,0,0,.6);
  --shadow-soft: rgba(0,0,0,.4);
}
```

- [ ] Extract shadow colours into variables; add dark-mode overrides
- [ ] Verify shadow visibility across both themes

## Accessibility

The OKLCH palette has been swept for WCAG AA (contrast + gamut, both modes,
including the `--bg-light` content surface) — all combinations pass. The old
HSL `accessibility-report.js` was retired. When adding or re-theming colours,
re-validate with an ad-hoc OKLCH contrast+gamut sweep (see `Colors.md`).

## Photo-grid captions

- [ ] Optional JS: sample each thumbnail's brightness on load and toggle a
      `caption--light` / `caption--dark` class, inverting text/scrim per image
      (white-on-dark for light photos, dark-on-light for dark ones). The current
      fixed dark scrim + text-shadow stays legible on any image without JS —
      revisit only if per-image inversion is wanted.
