const fs = require('fs');

const css = fs.readFileSync('src/index.css', 'utf8');
const newCss = css.replace('@import "tw-animate-css";', `@import "tw-animate-css";\n\n@theme {\n  --color-bg-app: var(--bg-app);\n  --color-bg-surface: var(--bg-surface);\n  --color-bg-surface-elevated: var(--bg-surface-elevated);\n  --color-bg-surface-hover: var(--bg-surface-hover);\n  --color-bg-overlay: var(--bg-overlay);\n  --color-text-primary: var(--text-primary);\n  --color-text-secondary: var(--text-secondary);\n  --color-text-muted: var(--text-muted);\n  --color-border-subtle: var(--border-subtle);\n  --color-border-medium: var(--border-medium);\n  --color-accent-primary: var(--accent-primary);\n  --color-accent-hover: var(--accent-hover);\n}\n`);

let updatedRoot = newCss.replace(':root {', `:root {\n  --bg-overlay: rgba(255, 255, 255, 0.8);\n  --accent-primary: #10b981;\n  --accent-hover: #059669;`);
updatedRoot = updatedRoot.replace('html.dark {', `html.dark {\n  --bg-overlay: rgba(18, 30, 26, 0.8);\n  --accent-primary: #34d399;\n  --accent-hover: #10b981;`);

fs.writeFileSync('src/index.css', updatedRoot);
console.log('index.css updated');
