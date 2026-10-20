# Production release — 20 October 2026

The user approved production publication on 20 October 2026. The previously blocked deployment step is now complete.

- Public website: https://powercalc-hub.vercel.app/
- Deployed source: 3c63eaebe30ddd95eb9286b5add7c3f3b89c9d07 on feat/import-astro-project.
- Vercel production deployment: powercalc-eutkjxwvj-global-time-compare.vercel.app (Ready).
- Build uses PUBLIC_SITE_URL=https://powercalc-hub.vercel.app; production pages have matching canonical URLs and no noindex directive.
- Re-ran check, 58 tests, build, built-route verification and npm audit successfully; zero vulnerabilities.
- Anonymous HTTP checks: all 13 pages plus sitemap index, sitemap and robots.txt returned 200.
- Browser check: UPS calculator changed from 0.5 to 0.25 hours when load increased from 120 to 240 W.
- Deployment came from the feature branch; PR #1 remains open. Git auto-deployment is not connected.

The initial report below is historical and describes the earlier no-production restriction.

---

# Verification — 18 October 2026

Environment: existing congenial goggles Codespace; Node.js 24.21.0.

- npm install: completed, lockfile generated.
- npm run check: 0 errors, 0 warnings, 0 hints.
- npm test: 58 passed, 0 failed, including 41 missing-input regression cases.
- npm run build: 13 static pages and sitemap-index.xml generated.
- npm run verify:build: all 13 pages, ten compiled calculator modules and sitemap entries verified; also runs in CI.
- npm audit: 0 vulnerabilities after updating Astro to 7.4.0.
- Browser checks: all 10 calculator routes at 320, 360, 390, 430 and 1280 CSS pixels; 50/50 passed expected results, no horizontal document overflow and theme toggling. Appliance check selected one LED bulb. Homepage UPS search showed only the UPS card.
- These are desktop Chromium iframe viewport checks, not physical Android/iOS device tests.
- Preview uses noindex,nofollow. A verified production canonical URL must be configured before production.
- Source ZIP, build outputs, node_modules and local credentials are excluded from Git.
- Vercel CLI authentication is complete and the powercalc-hub project is linked. An explicit `vercel deploy --target preview --yes` request was classified as Production by Vercel for the first deployment. That unintended deployment was removed immediately. The dashboard now shows No Production Deployment, and the production domain returns DEPLOYMENT_NOT_FOUND. No Vercel preview URL is available: further deployment is blocked by the no-production requirement and Vercel first-deployment behavior. See https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting. The new .vercelignore was dry-run verified to exclude credentials, ZIP, node_modules, .astro and dist.

Final follow-up: reproduced missing-input failures before fixing non-finite results; all 58 tests pass afterward. Re-ran npm install, check, test, build, verify:build and audit successfully. Node engines now restrict support to 22.22+ and 24.x; the Codespace and CI use Node 24. No additional dependencies were introduced.
