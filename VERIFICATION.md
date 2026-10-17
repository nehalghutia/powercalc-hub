# Verification — 18 October 2026

Environment: existing congenial goggles Codespace; Node.js 24.21.0.

- npm install: completed, lockfile generated.
- npm run check: 0 errors, 0 warnings, 0 hints.
- npm test: 17 passed, 0 failed.
- npm run build: 13 static pages and sitemap-index.xml generated.
- npm audit: 0 vulnerabilities after updating Astro to 7.4.0.
- Browser checks: all 10 calculator routes at 320, 360, 390, 430 and 1280 CSS pixels; 50/50 passed expected results, no horizontal document overflow and theme toggling. Appliance check selected one LED bulb. Homepage UPS search showed only the UPS card.
- These are desktop Chromium iframe viewport checks, not physical Android/iOS device tests.
- Preview uses noindex,nofollow. A verified production canonical URL must be configured before production.
- Source ZIP, build outputs, node_modules and local credentials are excluded from Git.
- No production deployment authorized or performed. Vercel CLI authentication is still required for a preview deployment.
