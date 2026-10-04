# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Astro Calendar: a client-only React PWA that shows a monthly calendar where each day carries a horizontal 24h strip of
daylight, night, astronomical night and moonless (astro) night, plus the moon phase, for a chosen location.

## Commands

Node version is pinned in `.nvmrc` (26).

- `npm run dev`: Vite dev server
- `npm run build`: writes `public/version`, type-checks (`tsc -b`), then `vite build` into `dist/`
- `npm run lint`: oxlint (also runs inside Vite through `vite-plugin-oxlint`)
- `npx prettier --write <files>`: formatting (single quotes, no trailing commas, 120 cols, `arrowParens: avoid`)
- `npm run preview`: serve the production build

There is no test suite. `tsc -b` (strict, `noUnusedLocals`/`noUnusedParameters`, `verbatimModuleSyntax`) is the main
correctness check, so type-only imports must use `import type`.

## Architecture

### Data flow

`src/index.tsx` nests `DateProvider` → `LocationProvider` → `CalendarProvider` → `App`. `App` calls `useWorker()`
(`src/calendar/calendar.hooks.ts`), which posts `{ jobId, date, weekOffset, location }` to a Web Worker whenever the
date or coordinates change, and stores the returned `CalendarDay[]` in the calendar state. Responses with an outdated
`jobId` are dropped. All astronomy runs in the worker; UI components only read the precomputed days.

### State (`src/provider/`)

No external state library. `context.selector.ts` is a small selector-based context built on `useSyncExternalStore`, so
consumers re-render only when their selected slice changes. `createStateContext` / `StateProvider` wrap it into a
`[state, setState]` pair. Each domain exposes its own hooks (`useDate`, `useDateSetter`, `useCoords`, `useDays`, …)
from `<domain>.hooks.ts`; components use those hooks rather than the contexts directly. Location is persisted to
`localStorage` via `StateProvider`'s `onChange`.

### Calculator (`src/calculator/`)

Pure functions, timestamps in ms (`Timestamp`), angles in radians internally (`Position`), degrees at the API edge.

- `calculator.ts`: builds the month grid (padding days from the previous/next month, tagged with `classNames`).
- `calculator.night.ts`: per day, computes `night` (sun below horizon), `astroNight` (sun below −18°), `moonNight`
  (moon below horizon) and `moonlessNight` = astroNight ∩ moonNight, plus moon phase/illumination.
- `calculator.sun.ts`: own sun-position formulas (sources linked in the file). `calculator.moon.ts` uses `suncalc`.
- `calculator.bands.ts`: converts the night intervals into `Band`s, i.e. `[start, end]` fractions (0..1) of a calendar
  day. A day's strip combines the previous night's tail (morning) and the current night's start (evening), so the
  previous day's intervals are needed too.

`Interval` bounds can be `±Infinity` (polar day/night: open-ended), and an interval with `start > end` means there is
no night on that side; both cases are handled in `forceIntervalToDay`. Keep these semantics when changing calculations.

### Feature directories

Code is organised per domain (`calendar/`, `date/`, `location/`, `moon/`, `header/`, `version/`, …), with files named
`<domain>.<role>.ts(x)` (`.hooks`, `.provider`, `.utils`, `.types`, `.scss` next to its component). UI is Material UI (MUI 9, emotion)
in a dark theme (`src/theme/theme.ts`, based on the one in `../astroffers`: flat papers, 14px base font, small fields by
default, `cssVariables: true`) with the same `#111418` background and `#1c2127` papers as `../astroffers`, and the app's blue-grey accents (`#111418`
weekday and `#1c2127` weekend cells, `#30404d` hover/selected, `#0b0e11` grid lines, `#6f3434` today), styles are SCSS. `StyledEngineProvider injectFirst` (`index.tsx`) puts MUI's styles first, so
the SCSS overrides them at the same specificity. Place search uses the Nominatim (OpenStreetMap) API.

### Conventions and decisions

- The stack and structure deliberately mirror `../tinc/dashboard` (Vite, strict TS, `.oxlintrc.json`,
  `.prettierrc`, `src/provider/*` copied from it). When in doubt, follow what tinc does.
- No `React.memo`, and no external state library (`use.io` was removed). Prefer immutable code (`Array.from`, spread,
  early `return` per branch) over `push`/reassignment.
- Colors: use the MUI theme CSS variables (`var(--mui-palette-*)`), not hex values or SCSS variables. The only
  exception is the band colors in `calendar.bands.scss` (mirrored by the legend dots in `calendar.info.scss`).
  `theme-color` and the PWA manifest need literal hex values: keep them equal to the theme's `BACKGROUND` (`#111418`).
- The calendar day popover is an MUI `Popover` anchored to the clicked cell; place search is an `Autocomplete` with a
  controlled `inputValue` (only `reason === 'input'` updates it, so the prefilled place name survives blur/reset).
  Coordinates in the location dialog are plain number `TextField`s (`location.coordinate.tsx`).
- `moment` stays (decided against replacing it).
- The old CRA version is still live at `astro-calendar.surge.sh`; leave it untouched (no redirect or redeploy) unless asked.
  The Render URL carries a random suffix (`astro-calendar-ct40.onrender.com`), assigned because the plain name was taken.

### Versioning, PWA and deploy

- Deployed to Render as a static site from `master` (`render.yaml`); `RENDER_GIT_COMMIT` becomes the version.
- The version is baked in at build time (`import.meta.env.VERSION`, defined in `vite.config.ts`) and also written to
  `public/version` (git-ignored). `VersionListener` polls `/version` every minute and offers a reload when it differs;
  locally the version is `0`, so the check is skipped.
- `vite-plugin-pwa` with `autoUpdate`. Reloading to a new version first updates and activates the new service worker
  (`useReloadToLatestVersion`), because a plain reload would be served from the old precache. `/sw.js` is served with
  `Cache-Control: no-cache` for the same reason.
