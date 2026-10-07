# Slingshot Guidelines — Banking Customer Onboarding (KYC) Portal

> A guidelines file at the root of your project defining your team coding
> standards. Slingshot should have embedded these into prompts throughout
> development.

This file is fed into every Slingshot chat, Plan & Execute run, and Agent
Hook invocation scoped to this workspace, so the agent generates code that
already matches the team's conventions instead of generic defaults.

## Technology Stack
- Backend: Node.js with Express 4.x, CommonJS (`require` / `module.exports`)
- Frontend: Static HTML/CSS + vanilla JavaScript, no framework or bundler
- Persistence: Flat JSON file (`backend/db.json`) via a service layer in `models/`
- Auth: JWT (`jsonwebtoken`) for admin sessions, `bcryptjs` for password hashing
- Testing: Jest + Supertest

## Project Structure
- `backend/routes/` — one route file per resource (`kyc.js`, `admin.js`); route handlers stay thin
- `backend/models/` — all data-access and business logic (never inline it in a route handler)
- `backend/middleware/` — cross-cutting concerns (`auth.js` for `requireAdmin`)
- `backend/tests/` — Jest/Supertest specs, one file per route module
- `frontend/` — one HTML page per persona (`index.html` customer, `admin.html` admin), each with its own `js/*.js`
- `.slingshot/` — prompts and skills used during development
- `docs/` — Plan & Execute logs, Agent Hook notes, usage report

## Coding Standards
- `camelCase` for variables and functions, `UPPER_SNAKE_CASE` for constants (`VALID_STATUSES`, `REQUIRED_FIELDS`)
- Route handlers under ~25 lines — extract a helper once they grow past that
- Keep all API calls inside the page's own `js/*.js` file, never inline `fetch` in HTML
- Use the shared CSS custom properties in `css/styles.css` (`:root`) instead of hardcoding colors
- Escape user-supplied strings before inserting into the DOM (`escapeHtml` helper in `admin.js`)
- Don't add a new npm dependency without a one-line comment justifying it at the point of use

## API & Error Handling
- Error responses are always JSON: `{ "error": "message" }`, or `{ "errors": [...] }` for multi-field validation failures
- Every new endpoint needs explicit input validation, an explicit HTTP status code, and a matching test
- Status values are always one of the uppercase strings: `PENDING`, `APPROVED`, `REJECTED`
- Submission records always keep the fields `id`, `status`, `submittedAt`, `reviewedAt`, `reviewRemarks` — don't silently change this shape

## Security
- Every admin route must use the `requireAdmin` middleware from `backend/middleware/auth.js`
- Passwords are always hashed with `bcryptjs` (minimum cost factor 8) — never store or log plaintext
- JWT secret is read from `process.env.JWT_SECRET`; the in-code fallback is dev-only and must not ship to production
- Treat every customer-submitted field as untrusted input and validate it server-side, even though the frontend also validates
- Never log PII (full ID number, DOB, address) — log submission IDs and status transitions only

## Testing
- Framework: Jest + Supertest, colocated in `backend/tests/`
- Every route handler ships with at least one happy-path test and one validation/error-path test
- Every `requireAdmin` route has a test asserting a 401 with no token
- Tests reset `backend/db.json` in `beforeEach` so runs are order-independent
- `npm test` inside `backend/` must pass before opening a PR — this is also what the configured Agent Hook runs on file save

## Commit & PR Conventions
- Conventional commit prefixes: `feat:`, `fix:`, `test:`, `docs:`, `chore:`
- Feature work happens on a Worktree branch (`feature/<short-name>`), never directly on `main`
- Every PR description includes the Slingshot AI-generated review summary from the `code-review-template` prompt

## What Slingshot Should Avoid
- Introducing ESM or TypeScript without a team discussion first
- Generating mock/placeholder data into `backend/db.json` — seed data belongs in tests only
- Adding a frontend build step (bundler, framework) — the demo must run with zero build tooling
