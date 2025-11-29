**Project snapshot (1-2 lines)**
- React + TypeScript app bootstrapped with Vite. Uses Firebase (Auth + Firestore), Zustand for client state, and a local generated GraphQL connector in `src/dataconnect-generated`.

**Why this structure**
- `src/` contains a small SPA: `main.tsx` mounts `RouterProvider` (see `src/routes/router.tsx`) and pages are under `src/pages/*`.
- Auth is global and observed via `src/stores/useAuthStore.ts` which uses Firebase's `onAuthStateChanged`. That store also calls `UserDAO.createUser()` (Firestore side-effect) when a user signs in.
- `src/daos/*` contains Firestore wrappers (e.g., `UserDAO.ts`) — prefer using these instead of direct Firestore calls in UI code.
- `src/dataconnect-generated` is a local package (referenced in `package.json` as `file:src/dataconnect-generated`). Treat it as generated code: don't refactor it manually unless regenerating.

Quick dev commands
- Start development server: `npm run dev` (alias `vite`) — fast HMR.
- Build for production: `npm run build` (runs `tsc -b` then `vite build`).
- Preview production build: `npm run preview`.
- Lint: `npm run lint`.

Project-specific conventions and patterns
- Router: routes are declared in `src/routes/router.tsx` as an array then passed to `createBrowserRouter`. Add new routes there (keep import paths relative to `src/pages`).
- State: use Zustand (`useAuthStore`) for app-wide data. The store exposes `initAuthObserver()` which components (e.g., root-level layout) should call once to keep auth state synchronized.
- Persistence: Firestore access goes through DAO classes in `src/daos`. Use those helpers to keep consistency (timestamps, merge options).
- Firebase config: `src/lib/firebase.config.ts` creates `db`, `auth`, and `googleProvider`. These exports are consumed across the app. Do not change the config object unless you intentionally need to point to another Firebase project.
- Styling: project uses plain CSS files under `src/pages/*/*.css` alongside components (not CSS modules). Preserve class names when changing layout — components expect specific selectors.

Integration notes and gotchas
- Local generated package: `@dataconnect/generated` maps to `src/dataconnect-generated`. If you regenerate the connector, update that folder and keep package.json reference.
- React/Router versions: React 19 and React Router v7. Route element shape uses `element: <Component />` entries; follow that pattern.
- Typescript: project compiles via `tsc -b`. When adding new TS project references or changing tsconfig, update `tsconfig.app.json`/`tsconfig.node.json` accordingly.
- Secrets: `src/lib/firebase.config.ts` contains an API key and project IDs (checked into this repo). Avoid rotating or exposing additional secrets in the repo. If you must change auth behavior, prefer reading values from environment variables and document the change.

Where to look first for common tasks (examples)
- Add a new page: create `src/pages/<name>/<Name>.tsx` and `<Name>.css`, then add a route entry in `src/routes/router.tsx`.
- Add Firestore model: add a DAO in `src/daos` similar to `UserDAO.ts` and call it from stores or pages.
- Add global data: extend Zustand store in `src/stores` (follow `useAuthStore.ts` pattern) and expose stable API methods.

Testing & verification
- There are no automated tests in the repo. Verify changes locally with `npm run dev`, and build with `npm run build` to catch typing or bundling errors.
- For responsive UI work, check `src/pages/*/*.css` and test on `<=900px` and `<=480px` breakpoints — CSS is component-scoped by folder only, not module-scoped.

Rules for AI agents (do this, not that)
- Do: Edit component `.tsx` and corresponding `.css` files in the same folder to keep visual changes localized.
- Do: Use `src/daos/*` for Firestore operations; use `src/lib/firebase.config.ts` exports for auth/db providers.
- Do: Respect the generated package: do not modify files under `src/dataconnect-generated` unless you are regenerating the connector and understand the generator workflow.
- Do not: Change global build scripts or package references unless necessary — prefer adding code inside `src/` following existing patterns.
- Do not: Commit credentials or new secrets. If needed, propose a `.env` migration and document required variables.

Key files to open for onboarding
- `src/main.tsx` — app bootstrap
- `src/routes/router.tsx` — routing table
- `src/stores/useAuthStore.ts` — auth state & side-effects
- `src/daos/UserDAO.ts` — Firestore patterns
- `src/lib/firebase.config.ts` — Firebase services
- `package.json`, `tsconfig.app.json` — build & type-check rules

If you are unsure about a change
- Ask: state the minimal change, which files will be edited, and confirm whether to modify generated code.
- When changing layout/CSS: include screenshots or viewport sizes to reproduce the visual issue locally.

If anything here is unclear or missing, tell me what area you want expanded (build, dataflow, generators, or UI conventions) and I will iterate.

End of file