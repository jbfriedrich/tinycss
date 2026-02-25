// Comprehensive Accessibility Checker for demo.html
// Generates an HTML report showing WCAG contrast compliance for all elements

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrast(color1, color2) {
  const [r1, g1, b1] = hslToRgb(...color1);
  const [r2, g2, b2] = hslToRgb(...color2);
  const lum1 = getLuminance(r1, g1, b1);
  const lum2 = getLuminance(r2, g2, b2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

function checkWCAG(ratio, isLargeText = false) {
  const threshold = isLargeText ? 3.0 : 4.5;
  const aaPass = ratio >= threshold;
  const aaaPass = ratio >= (isLargeText ? 4.5 : 7.0);

  return {
    ratio: ratio.toFixed(2),
    aa: aaPass,
    aaa: aaaPass,
    level: aaaPass ? 'AAA' : (aaPass ? 'AA' : 'FAIL')
  };
}

function formatHSL(hsl) {
  return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
}

// Color definitions from style.css
const colors = {
  primary: {
    lightest: [320, 80, 95],
    light: [320, 80, 90],
    lighter: [320, 80, 70],
    base: [320, 80, 48],
    darker: [320, 80, 30],
    dark: [320, 80, 10],
    darkest: [320, 80, 5]
  },
  secondary: {
    lightest: [220, 80, 95],
    light: [220, 80, 90],
    lighter: [220, 80, 70],
    base: [220, 80, 50],
    darker: [220, 80, 30],
    dark: [220, 80, 10],
    darkest: [220, 80, 5]
  }
};

const themes = {
  dark: {
    bg: [0, 0, 5],
    text: [0, 0, 95],
    badgeTextOnLight: [0, 0, 0],
    badgeTextOnDark: [0, 0, 100]
  },
  light: {
    bg: [0, 0, 95],
    text: [0, 0, 5],
    badgeTextOnLight: [0, 0, 5],
    badgeTextOnDark: [0, 0, 100]
  }
};

const results = {
  dark: { pass: 0, fail: 0, tests: [] },
  light: { pass: 0, fail: 0, tests: [] }
};

// Test all combinations
for (const [themeName, theme] of Object.entries(themes)) {

  // 1. Body text on background
  const bodyTextResult = checkWCAG(getContrast(theme.text, theme.bg));
  results[themeName].tests.push({
    category: 'Page Elements',
    element: 'Body text',
    fg: formatHSL(theme.text),
    bg: formatHSL(theme.bg),
    ...bodyTextResult
  });
  if (bodyTextResult.aa) results[themeName].pass++;
  else results[themeName].fail++;

  // 2. Headings (large text - 3:1 threshold)
  const headingResult = checkWCAG(getContrast(theme.text, theme.bg), true);
  results[themeName].tests.push({
    category: 'Page Elements',
    element: 'Headings (large text)',
    fg: formatHSL(theme.text),
    bg: formatHSL(theme.bg),
    ...headingResult
  });
  if (headingResult.aa) results[themeName].pass++;
  else results[themeName].fail++;

  // 3. Primary button
  const primaryBtnResult = checkWCAG(getContrast(theme.badgeTextOnDark, colors.primary.base));
  results[themeName].tests.push({
    category: 'Buttons',
    element: 'Primary button',
    fg: formatHSL(theme.badgeTextOnDark),
    bg: formatHSL(colors.primary.base),
    ...primaryBtnResult
  });
  if (primaryBtnResult.aa) results[themeName].pass++;
  else results[themeName].fail++;

  // 4. Primary button hover
  const primaryBtnHoverResult = checkWCAG(getContrast(theme.badgeTextOnDark, colors.primary.darker));
  results[themeName].tests.push({
    category: 'Buttons',
    element: 'Primary button (hover)',
    fg: formatHSL(theme.badgeTextOnDark),
    bg: formatHSL(colors.primary.darker),
    ...primaryBtnHoverResult
  });
  if (primaryBtnHoverResult.aa) results[themeName].pass++;
  else results[themeName].fail++;

  // 5. Secondary button
  const secondaryBtnResult = checkWCAG(getContrast(theme.badgeTextOnDark, colors.secondary.base));
  results[themeName].tests.push({
    category: 'Buttons',
    element: 'Secondary button',
    fg: formatHSL(theme.badgeTextOnDark),
    bg: formatHSL(colors.secondary.base),
    ...secondaryBtnResult
  });
  if (secondaryBtnResult.aa) results[themeName].pass++;
  else results[themeName].fail++;

  // 6. Secondary button hover
  const secondaryBtnHoverResult = checkWCAG(getContrast(theme.badgeTextOnDark, colors.secondary.darker));
  results[themeName].tests.push({
    category: 'Buttons',
    element: 'Secondary button (hover)',
    fg: formatHSL(theme.badgeTextOnDark),
    bg: formatHSL(colors.secondary.darker),
    ...secondaryBtnHoverResult
  });
  if (secondaryBtnHoverResult.aa) results[themeName].pass++;
  else results[themeName].fail++;

  // 7. All solid badges
  for (const [colorName, shades] of Object.entries(colors)) {
    for (const [shadeName, bgColor] of Object.entries(shades)) {
      const isLightBg = ['lightest', 'light', 'lighter'].includes(shadeName);
      const textColor = isLightBg ? theme.badgeTextOnLight : theme.badgeTextOnDark;
      const badgeResult = checkWCAG(getContrast(bgColor, textColor));

      results[themeName].tests.push({
        category: 'Solid Badges',
        element: `.badge-${colorName}-${shadeName}`,
        fg: formatHSL(textColor),
        bg: formatHSL(bgColor),
        ...badgeResult
      });
      if (badgeResult.aa) results[themeName].pass++;
      else results[themeName].fail++;
    }
  }

  // 8. All outline badges
  for (const [colorName, shades] of Object.entries(colors)) {
    for (const [shadeName, badgeColor] of Object.entries(shades)) {
      const outlineResult = checkWCAG(getContrast(badgeColor, theme.bg));

      results[themeName].tests.push({
        category: 'Outline Badges',
        element: `.badge-outline-${colorName}-${shadeName}`,
        fg: formatHSL(badgeColor),
        bg: formatHSL(theme.bg),
        ...outlineResult
      });
      if (outlineResult.aa) results[themeName].pass++;
      else results[themeName].fail++;
    }
  }

  // 9. Code elements
  const codeInlineResult = checkWCAG(getContrast(theme.text, theme.bg));
  results[themeName].tests.push({
    category: 'Code Elements',
    element: 'Inline code',
    fg: formatHSL(theme.text),
    bg: formatHSL(theme.bg),
    ...codeInlineResult
  });
  if (codeInlineResult.aa) results[themeName].pass++;
  else results[themeName].fail++;

  // 10. Code block (pre)
  const codeBlockTextColor = colors.secondary.lighter;
  const codeBlockBgColor = colors.primary.darkest;
  const codeBlockResult = checkWCAG(getContrast(codeBlockTextColor, codeBlockBgColor));
  results[themeName].tests.push({
    category: 'Code Elements',
    element: 'Code blocks (pre)',
    fg: formatHSL(codeBlockTextColor),
    bg: formatHSL(codeBlockBgColor),
    ...codeBlockResult
  });
  if (codeBlockResult.aa) results[themeName].pass++;
  else results[themeName].fail++;

  // 11. Links
  const linkResult = checkWCAG(getContrast(colors.primary.base, theme.bg));
  results[themeName].tests.push({
    category: 'Links',
    element: 'Link color',
    fg: formatHSL(colors.primary.base),
    bg: formatHSL(theme.bg),
    ...linkResult
  });
  if (linkResult.aa) results[themeName].pass++;
  else results[themeName].fail++;
}

// Generate HTML report
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessibility Report - demo.html</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      padding: 2rem;
      background: #f5f5f5;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    h1 {
      margin-bottom: 0.5rem;
      color: #1a1a1a;
    }

    .subtitle {
      color: #666;
      margin-bottom: 2rem;
      font-size: 0.95rem;
    }

    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .summary-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .summary-card.light {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .summary-card h2 {
      font-size: 1.25rem;
      margin-bottom: 1rem;
      opacity: 0.95;
    }

    .summary-stats {
      display: flex;
      gap: 2rem;
      margin-bottom: 1rem;
    }

    .stat {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: bold;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.85rem;
      opacity: 0.9;
      margin-top: 0.25rem;
    }

    .pass-rate {
      font-size: 1.1rem;
      padding-top: 0.5rem;
      border-top: 1px solid rgba(255,255,255,0.3);
    }

    .theme-section {
      margin-bottom: 3rem;
    }

    .theme-header {
      background: #f8f9fa;
      padding: 1rem 1.5rem;
      border-radius: 6px;
      margin-bottom: 1.5rem;
      border-left: 4px solid #667eea;
    }

    .theme-header.light {
      border-left-color: #f5576c;
    }

    .theme-header h2 {
      color: #1a1a1a;
      font-size: 1.5rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 2rem;
      font-size: 0.9rem;
    }

    thead {
      background: #f8f9fa;
    }

    th {
      text-align: left;
      padding: 0.75rem;
      font-weight: 600;
      color: #495057;
      border-bottom: 2px solid #dee2e6;
    }

    td {
      padding: 0.75rem;
      border-bottom: 1px solid #e9ecef;
    }

    tbody tr:hover {
      background: #f8f9fa;
    }

    .color-swatch {
      display: inline-block;
      width: 60px;
      height: 24px;
      border-radius: 4px;
      border: 1px solid #dee2e6;
      vertical-align: middle;
      margin-right: 0.5rem;
    }

    .color-preview {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
    }

    .ratio {
      font-weight: 600;
      font-family: monospace;
    }

    .level {
      display: inline-block;
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.8rem;
      text-transform: uppercase;
    }

    .level.aaa {
      background: #d4edda;
      color: #155724;
    }

    .level.aa {
      background: #d1ecf1;
      color: #0c5460;
    }

    .level.fail {
      background: #f8d7da;
      color: #721c24;
    }

    .category-header {
      background: #e9ecef;
      font-weight: 600;
      color: #495057;
    }

    .legend {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 6px;
      margin-top: 2rem;
    }

    .legend h3 {
      margin-bottom: 1rem;
      color: #495057;
    }

    .legend-items {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .legend-item strong {
      min-width: 60px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Accessibility Report</h1>
    <p class="subtitle">WCAG 2.1 Contrast Compliance Analysis for demo.html</p>

    <div class="summary">
      <div class="summary-card">
        <h2>🌙 Dark Mode</h2>
        <div class="summary-stats">
          <div class="stat">
            <span class="stat-value">${results.dark.pass}</span>
            <span class="stat-label">Passed</span>
          </div>
          <div class="stat">
            <span class="stat-value">${results.dark.fail}</span>
            <span class="stat-label">Failed</span>
          </div>
        </div>
        <div class="pass-rate">
          Pass Rate: ${((results.dark.pass / (results.dark.pass + results.dark.fail)) * 100).toFixed(1)}%
        </div>
      </div>

      <div class="summary-card light">
        <h2>☀️ Light Mode</h2>
        <div class="summary-stats">
          <div class="stat">
            <span class="stat-value">${results.light.pass}</span>
            <span class="stat-label">Passed</span>
          </div>
          <div class="stat">
            <span class="stat-value">${results.light.fail}</span>
            <span class="stat-label">Failed</span>
          </div>
        </div>
        <div class="pass-rate">
          Pass Rate: ${((results.light.pass / (results.light.pass + results.light.fail)) * 100).toFixed(1)}%
        </div>
      </div>
    </div>

    ${['dark', 'light'].map(themeName => {
      const themeData = results[themeName];
      const categorized = {};

      themeData.tests.forEach(test => {
        if (!categorized[test.category]) categorized[test.category] = [];
        categorized[test.category].push(test);
      });

      return `
        <div class="theme-section">
          <div class="theme-header ${themeName}">
            <h2>${themeName === 'dark' ? '🌙' : '☀️'} ${themeName.charAt(0).toUpperCase() + themeName.slice(1)} Mode Results</h2>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 20%;">Element</th>
                <th style="width: 15%;">Foreground</th>
                <th style="width: 15%;">Background</th>
                <th style="width: 15%;">Preview</th>
                <th style="width: 12%;">Ratio</th>
                <th style="width: 10%;">Level</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(categorized).map(([category, tests]) => `
                <tr class="category-header">
                  <td colspan="6">${category}</td>
                </tr>
                ${tests.map(test => `
                  <tr>
                    <td>${test.element}</td>
                    <td><code style="font-size: 0.8rem;">${test.fg}</code></td>
                    <td><code style="font-size: 0.8rem;">${test.bg}</code></td>
                    <td>
                      <div class="color-preview" style="background: ${test.bg}; color: ${test.fg}; border: 1px solid #ccc;">
                        Sample Aa
                      </div>
                    </td>
                    <td class="ratio">${test.ratio}:1</td>
                    <td><span class="level ${test.level.toLowerCase()}">${test.level}</span></td>
                  </tr>
                `).join('')}
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }).join('')}

    <div class="legend">
      <h3>Understanding the Results</h3>
      <div class="legend-items">
        <div class="legend-item">
          <span class="level aaa">AAA</span>
          <span>Exceeds enhanced contrast (7:1 normal, 4.5:1 large)</span>
        </div>
        <div class="legend-item">
          <span class="level aa">AA</span>
          <span>Meets minimum contrast (4.5:1 normal, 3:1 large)</span>
        </div>
        <div class="legend-item">
          <span class="level fail">FAIL</span>
          <span>Does not meet WCAG AA requirements</span>
        </div>
      </div>
      <p style="margin-top: 1rem; color: #666; font-size: 0.9rem;">
        <strong>Note:</strong> Large text is defined as 18pt+ (24px+) regular or 14pt+ (18.66px+) bold.
        All tests are performed according to WCAG 2.1 Level AA standards.
      </p>
    </div>
  </div>
</body>
</html>`;

// Write the HTML report
const fs = require('fs');
fs.writeFileSync('accessibility-report.html', html);

console.log('✅ Accessibility report generated: accessibility-report.html');
console.log('');
console.log('SUMMARY:');
console.log('========');
console.log(`Dark Mode:  ${results.dark.pass} passed, ${results.dark.fail} failed (${((results.dark.pass / (results.dark.pass + results.dark.fail)) * 100).toFixed(1)}% pass rate)`);
console.log(`Light Mode: ${results.light.pass} passed, ${results.light.fail} failed (${((results.light.pass / (results.light.pass + results.light.fail)) * 100).toFixed(1)}% pass rate)`);
