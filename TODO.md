# TODO List - CSS Boilerplate

## Future Enhancements

### 1. OKLCH Color Space Conversion

Consider migrating from HSL to OKLCH (Oklab Lightness Chroma Hue) color space for improved color quality and perceptual uniformity.

---

## OKLCH Overview

OKLCH is a perceptually uniform color space that represents colors more accurately to how humans perceive them.

### Syntax

```css
--color: oklch(L C H);
/* L = Lightness (0-1 or 0%-100%) */
/* C = Chroma/saturation (0-0.4 typically) */
/* H = Hue (0-360 degrees) */
```

### Example

```css
/* HSL */
--primary: hsl(320, 70%, 50%);

/* OKLCH equivalent */
--primary: oklch(60% 0.2 320);
```

---

## Advantages Over HSL

### 1. Perceptual Uniformity
- **HSL Problem**: Changing lightness values doesn't produce perceptually uniform results. Yellow at 50% lightness looks much brighter than blue at 50% lightness.
- **OKLCH Solution**: Lightness changes appear uniform to the human eye across all hues.

### 2. Wider Color Gamut
- Can represent colors outside the sRGB color space
- Access to more vibrant, saturated colors (if display supports P3 or wider gamuts)
- Future-proof for modern displays

### 3. Better for Programmatic Color Generation
- Our hue-rotation system (`--hue`, `--alt-hue`, `--tertiary-hue`) would work more predictably
- Chroma (saturation) behaves more consistently across different hues than HSL saturation
- Easier to create harmonious color palettes programmatically

### 4. Consistent Contrast
- Colors with the same lightness value have similar perceived brightness
- Better for accessibility and maintaining consistent contrast ratios

---

## Disadvantages

### 1. Browser Support Requirements
- **Safari 15.4+** (March 2022)
- **Chrome 111+** (March 2023)
- **Firefox 113+** (May 2023)
- **Edge 111+** (March 2023)
- **NO Internet Explorer support** (never)

**Current global support: ~90%** (as of 2024)

### 2. Learning Curve
- Less familiar than HSL to most developers
- Chroma values aren't as intuitive as HSL saturation percentages
- Requires understanding of perceptual color spaces

### 3. Alpha Channel Limitation
Still has the same limitation as HSL - cannot dynamically extract values for alpha channel manipulation without experimental CSS features.

```css
/* This DOESN'T work in standard CSS */
--shadow: 0 2px 4px oklch(from var(--bg) l c h / 30%);
```

### 4. Gamut Clipping
- Colors can exceed display capabilities and get clipped
- Need to be mindful of chroma values to stay within sRGB for older displays

---

## Browser Support Details

### Current Support (January 2025)

| Browser | Version | Release Date | Support |
|---------|---------|--------------|---------|
| Safari | 15.4+ | March 2022 | ✅ Full |
| Chrome | 111+ | March 2023 | ✅ Full |
| Firefox | 113+ | May 2023 | ✅ Full |
| Edge | 111+ | March 2023 | ✅ Full |
| Opera | 97+ | March 2023 | ✅ Full |
| Samsung Internet | 21+ | May 2023 | ✅ Full |
| Internet Explorer | All | N/A | ❌ Never |

**Can I Use Link**: https://caniuse.com/css-color-function

---

## Implementation Examples

### Current HSL System

```css
:root {
  --hue: 320;
  --alt-hue: calc(var(--hue) - 180);
  --tertiary-hue: calc(var(--hue) + 300);
  --accent-hue: calc(var(--hue) + 60);

  /* Primary colors */
  --primary-light: hsl(var(--hue), 70%, 90%);
  --primary-lighter: hsl(var(--hue), 70%, 70%);
  --primary: hsl(var(--hue), 70%, 50%);
  --primary-darker: hsl(var(--hue), 70%, 30%);
  --primary-dark: hsl(var(--hue), 70%, 10%);

  /* Secondary colors */
  --secondary-light: hsl(var(--alt-hue), 70%, 90%);
  --secondary-lighter: hsl(var(--alt-hue), 70%, 70%);
  --secondary: hsl(var(--alt-hue), 70%, 50%);
  --secondary-darker: hsl(var(--alt-hue), 70%, 30%);
  --secondary-dark: hsl(var(--alt-hue), 70%, 10%);
}
```

### Proposed OKLCH System

```css
:root {
  --hue: 320;
  --alt-hue: calc(var(--hue) - 180);
  --tertiary-hue: calc(var(--hue) + 300);
  --accent-hue: calc(var(--hue) + 60);

  /* Primary colors - OKLCH */
  --primary-light: oklch(90% 0.15 var(--hue));
  --primary-lighter: oklch(75% 0.15 var(--hue));
  --primary: oklch(60% 0.2 var(--hue));
  --primary-darker: oklch(40% 0.2 var(--hue));
  --primary-dark: oklch(25% 0.15 var(--hue));

  /* Secondary colors - OKLCH */
  --secondary-light: oklch(90% 0.15 var(--alt-hue));
  --secondary-lighter: oklch(75% 0.15 var(--alt-hue));
  --secondary: oklch(60% 0.2 var(--alt-hue));
  --secondary-darker: oklch(40% 0.2 var(--alt-hue));
  --secondary-dark: oklch(25% 0.15 var(--alt-hue));
}
```

### Background Colors with OKLCH

```css
:root {
  /* Light mode backgrounds */
  --bg-light: oklch(100% 0 var(--hue));     /* Pure white */
  --bg: oklch(95% 0.01 var(--hue));         /* Very subtle tint */
  --bg-dark: oklch(90% 0.02 var(--hue));    /* Slightly more tinted */

  /* Text colors */
  --text: oklch(10% 0 var(--hue));          /* Very dark, slight tint */
  --text-muted: oklch(40% 0.01 var(--hue)); /* Medium gray */
}

:root[data-theme=dark] {
  /* Dark mode backgrounds */
  --bg-dark: oklch(0% 0 var(--hue));        /* Pure black */
  --bg: oklch(10% 0.01 var(--hue));         /* Very dark with subtle tint */
  --bg-light: oklch(15% 0.02 var(--hue));   /* Slightly lighter */

  /* Text colors */
  --text: oklch(95% 0 var(--hue));          /* Nearly white */
  --text-muted: oklch(65% 0.01 var(--hue)); /* Medium light gray */
}
```

---

## Shadow System Considerations

The alpha channel limitation still exists with OKLCH, so the hybrid approach with separate shadow variables is still recommended:

```css
:root {
  /* Use OKLCH for main colors */
  --bg-light: oklch(100% 0 320);
  --bg: oklch(95% 0.01 320);
  --bg-dark: oklch(90% 0.02 320);

  /* Keep separate shadow color variables (RGBA) */
  --shadow-highlight: rgba(255, 255, 255, 0.3);
  --shadow-dark: rgba(0, 0, 0, 0.3);
  --shadow-soft: rgba(0, 0, 0, 0.15);

  /* Compose shadows from variables */
  --shadow-s: inset 0 1px 2px var(--shadow-highlight),
              0 1px 2px var(--shadow-dark),
              0 2px 4px var(--shadow-soft);
}

:root[data-theme=dark] {
  /* Override shadow colors for dark mode */
  --shadow-highlight: rgba(255, 255, 255, 0.15);
  --shadow-dark: rgba(0, 0, 0, 0.6);
  --shadow-soft: rgba(0, 0, 0, 0.4);
  /* Shadows automatically adapt */
}
```

---

## Migration Strategy

### Phase 1: Testing
1. Create a separate `style-oklch.css` file
2. Convert color definitions to OKLCH
3. Test in modern browsers (Chrome, Firefox, Safari)
4. Compare visual results side-by-side with HSL version

### Phase 2: Fallback Strategy
Implement progressive enhancement with CSS `@supports`:

```css
:root {
  /* HSL fallback */
  --primary: hsl(320, 70%, 50%);
}

@supports (color: oklch(0% 0 0)) {
  :root {
    /* OKLCH for supporting browsers */
    --primary: oklch(60% 0.2 320);
  }
}
```

### Phase 3: Full Migration
Once browser support is acceptable for your user base:
1. Replace all HSL colors with OKLCH equivalents
2. Update documentation
3. Remove HSL fallbacks if no longer needed

---

## Tools & Resources

### Color Conversion Tools
- **OKLCH Color Picker**: https://oklch.com/
- **Colorjs.io Converter**: https://colorjs.io/apps/convert/
- **OKLCH Palette Generator**: https://www.radix-ui.com/colors

### Learning Resources
- **MDN OKLCH Documentation**: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch
- **A perceptual color space for image processing**: https://bottosson.github.io/posts/oklab/
- **OKLCH in CSS**: https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl

### Browser Support
- **Can I Use - OKLCH**: https://caniuse.com/css-color-function
- **MDN Browser Compatibility**: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch#browser_compatibility

---

## Decision Criteria

### Use OKLCH if:
- ✅ You don't need to support browsers older than mid-2023
- ✅ You want more vibrant, perceptually uniform colors
- ✅ You're doing programmatic color generation (like our hue rotation system)
- ✅ You want to be future-proof for wide-gamut displays
- ✅ Your user base uses modern browsers (>90% support needed)

### Stick with HSL if:
- ❌ You need to support older browsers or Internet Explorer
- ❌ Your users might be on outdated browsers
- ❌ You want maximum compatibility
- ❌ You prefer the familiarity of HSL
- ❌ Browser support below 90% is a concern

---

## Current Recommendation

**For this boilerplate**: Stick with HSL for now, but keep OKLCH in mind for a future v2.0 release when browser support reaches 95%+ globally.

**Revisit decision**: Q1 2026 or when global browser support exceeds 95%

---

## Additional TODOs

### Immediate (Current HSL System)

- [ ] Ensure all color combinations are fully WCAG AA compliant (run `node accessibility-report.js` and fix any failures)
- [ ] Implement hybrid shadow system with separate color variables
- [ ] Add dark mode shadow overrides for better visibility
- [ ] Test shadow visibility across both light and dark themes

### Blog components (now in style.css)

- [ ] Photo-grid captions: optional JS to sample each thumbnail's brightness on load and toggle a `caption--light` / `caption--dark` class, inverting text/scrim per image (white-on-dark for light photos, dark-on-light for dark photos). The current approach is a fixed dark scrim + text-shadow that stays legible on any image without JS — revisit only if per-image inversion is wanted.

### Future (OKLCH Migration)
- [ ] Create OKLCH color conversion chart for current palette
- [ ] Build OKLCH test branch
- [ ] Conduct browser compatibility testing
- [ ] Measure performance impact (if any)
- [ ] Update documentation with OKLCH examples
- [ ] Consider creating both HSL and OKLCH versions

---

## Notes

- Current hue: **320** (Magenta/Pink)
- Alternative hue: **140** (calc(320 - 180), Cyan/Green)
- Tertiary hue: **260** (calc(320 + 300), Blue/Violet)
- Accent hue: **20** (calc(320 + 60), Orange/Red)

These hue relationships will work identically in both HSL and OKLCH color spaces.
