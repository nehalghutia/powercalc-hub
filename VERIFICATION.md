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
- Vercel CLI authentication is complete and the powercalc-hub project is linked. An explicit `vercel deploy --target preview --yes` request was classified as Production by Vercel for the first deployment. That unintended deployment was removed immediately. The dashboard now shows No Production Deployment, and the production domain returns DEPLOYMENT_NOT_FOUND. No Vercel preview URL is available: further deployment is blocked by the no-production requirement and Vercel first-deployment behavior. See https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting. The new .vercelignore was dry-run verified to exclude credentials, ZIP, node_modules, .astro and dist.
