# PowerCalc Hub

Static-first power, battery, inverter, UPS, solar and generator calculators built with Astro, TypeScript and Tailwind CSS.

## Setup

Use GitHub Codespaces (Node.js 22.22 or later (Node.js 24 recommended)):

```bash
npm install
npm run check
npm test
npm run build
npm run dev
```

## Deployment

Import this repository into Vercel, select Astro, build command `npm run build`, output directory `dist`. Verify preview before production.

## Status

The complete Astro source is imported. Review feature-branch verification and preview before production.

## Architecture

- `src/pages/` homepage, information pages, and statically generated calculator routes
- `src/lib/data.ts` calculator definitions, fields, SEO content and appliance presets
- `src/lib/calculate.ts` browser-safe numeric calculation engine
- `src/components/` reusable analytics and future advertising placeholders
- `src/layouts/Base.astro` page metadata, navigation and responsive layout
- `src/styles/global.css` Tailwind v4 CSS entry
- `tests/` dependency-free Node calculation tests
- `public/` favicon and robots

To add a calculator, add its metadata and field definitions in `src/lib/data.ts`, implement its validated formula in `src/lib/calculate.ts`, and add numerical test cases. The dynamic `[slug].astro` route statically generates the URL.

## Preview indexing

Previews use noindex, nofollow. Production requires VERCEL_ENV=production and PUBLIC_SITE_URL set to the verified canonical domain. No secrets belong in PUBLIC_ variables.

Build verification: run `npm run verify:build` after `npm run build` to check all ten calculator pages, their compiled scripts, and sitemap coverage.
