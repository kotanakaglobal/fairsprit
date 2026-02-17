# FairSprit

A small Next.js App Router project with a calculator UI and testable calculation logic.

## Features

- Next.js 15 + React 19 setup.
- Calculator page implemented with client-side state.
- Shared calculation utility in `lib/calc.ts`.
- Unit tests for calculator behavior using Vitest.
- Export helpers to package the repository.

## Quick start

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Scripts

- `npm run dev` — start local dev server.
- `npm run build` — production build.
- `npm run start` — run built app.
- `npm run lint` — lint project.
- `npm run test` — run unit tests.

## Export scripts

Create release artifacts into `release/`:

```bash
./scripts/export-full-project.sh
./scripts/export-zip.sh
```

## Project structure

```txt
app/
  globals.css
  layout.tsx
  page.tsx
lib/
  calc.ts
tests/
  calc.test.ts
scripts/
  export-full-project.sh
  export-zip.sh
```

## Notes

- Division by zero throws an explicit error.
- Input validation is done in the UI before calling the calculation utility.
