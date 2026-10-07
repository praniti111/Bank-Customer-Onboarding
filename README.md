# Banking Customer Onboarding (KYC) Portal

A full-stack demo built for the **Leading w/ PS AI Products — Slingshot Use
Case Submission**. It's a small but fully functional banking onboarding
flow: customers submit KYC details through a web form, and bank admins
review, approve, or reject each submission from a protected dashboard.

## Features

- **Customer portal** (`frontend/index.html`) — KYC submission form with
  server-side validation, plus a "track my status" lookup by submission ID.
- **Admin dashboard** (`frontend/admin.html`) — JWT-protected login, a
  filterable submissions table, a detail view, and approve/reject actions
  with optional remarks.
- **Backend API** (`backend/`) — Express REST API, JSON-file persistence
  (`backend/db.json`, git-ignored), bcrypt-hashed admin credentials, JWT
  auth for admin routes.
- **11 passing Jest/Supertest tests** covering both route modules.

## Project Structure

```
banking-kyc-portal/
├── slingshot-guidelines.md            # Team coding standards (req #1)
├── .slingshot/
│   └── prompts/                       # Local prompt files (req #2)
│       ├── problems/                  # Business/feature problem definitions
│       │   └── kyc-onboarding-system.prompt.md
│       ├── skills/                    # Reusable implementation skills (req #3)
│       │   ├── kyc-field-validation.prompt.md
│       │   ├── jwt-admin-auth.prompt.md
│       │   └── json-service-layer.prompt.md
│       ├── hooks/                     # Validation-hook definitions (req #4)
│       │   ├── kyc-submission-validation-tests.prompt.md
│       │   └── admin-auth-validation-tests.prompt.md
│       └── templates/                 # Reusable planning/review templates
│           ├── feature-implementation.prompt.md
│           └── code-review-template.prompt.md
├── .slingshot.config.js               # Testing/persistence/auth config (req #5)
├── .slingshot.mcp.json                # MCP server integrations (req #6)
├── .ssworkspaceignore                 # Workspace scan exclusions (req #7)
├── docs/
│   ├── plan-and-execute-log.md
│   ├── agent-hooks.md
│   ├── sample-pr-description.md
│   └── slingshot-usage-report.md      # (req #9 — see note inside)
├── backend/
│   ├── server.js
│   ├── routes/{kyc,admin}.js
│   ├── models/store.js
│   ├── middleware/auth.js
│   └── tests/{kyc,admin}.test.js
└── frontend/
    ├── index.html / admin.html
    ├── css/styles.css
    └── js/{customer,admin}.js
```

## Running It Locally

```bash
cd backend
npm install
npm test        # runs the 11 Jest/Supertest tests
npm start        # starts the API + serves the frontend on http://localhost:4000
```

Then open:
- `http://localhost:4000/` — customer KYC form
- `http://localhost:4000/admin.html` — admin dashboard

**Demo admin login**: `admin` / `Admin@123` (hardcoded for this demo only —
see `slingshot-guidelines.md` § Security for what a production version
would need instead).

## How I Used Slingshot

### Chat modes
- **Plan & Execute** — used for both major features (customer submission
  API + form, and the admin approval dashboard). Full generated plans and
  post-execution review notes are in
  [`docs/plan-and-execute-log.md`](docs/plan-and-execute-log.md), following
  the structure in
  `.slingshot/prompts/templates/feature-implementation.prompt.md`.
- **Agent mode** — used for the frontend JS (`customer.js`, `admin.js`),
  wiring fetch calls to the already-scaffolded backend routes.
- **Smart Chat** — used for smaller, single-file asks: the JWT middleware
  (`middleware/auth.js`) and iterating on the CSS design tokens in
  `styles.css`.

### Agent Hooks
Two hooks are configured (full detail in
[`docs/agent-hooks.md`](docs/agent-hooks.md)), each backed by a validation
hook prompt file:
1. **On Save → Generate & Run Unit Tests**, scoped to `backend/routes/*.js`
   and `backend/models/*.js` — regenerates the matching Jest test file
   against the scenarios in
   `.slingshot/prompts/hooks/kyc-submission-validation-tests.prompt.md` and
   `admin-auth-validation-tests.prompt.md`, then re-runs the suite on every save.
2. **On Save → Validate Admin Route Auth**, scoped to
   `backend/routes/admin.js` — checks every exported route uses the
   `requireAdmin` middleware, flagging an unauthenticated admin endpoint
   before it can be committed.

### @Workspace (RAG Search / Text Search)
- Used **RAG Search** when starting the admin dashboard to ask
  "where do we already do JWT-style auth in this codebase?" — useful once
  `middleware/auth.js` existed, to keep `admin.js` routes consistent with
  it rather than re-deriving the pattern.
- Used **Text Search** for exact-match lookups while refactoring — e.g.
  finding every literal usage of the string `"PENDING"` across
  `routes/`, `tests/`, and `frontend/js/` when confirming the status enum
  was used consistently before renaming anything.

### Worktree branches
Both major features were built on isolated Worktree branches —
`feature/customer-kyc-submission` and `feature/admin-approval-dashboard` —
merged into `main` independently once each feature's tests were green,
so the two features could be developed in parallel without one half-built
feature blocking the other.

### Slingshot Usage Report
See [`docs/slingshot-usage-report.md`](docs/slingshot-usage-report.md) for
the AI-generated code percentage and generation metrics from this project
(placeholder table — replace with your live report screenshot per the
instructions in that file).

## Slingshot Artefacts Checklist (per submission criteria)

| # | Artefact | Location |
|---|----------|----------|
| 1 | `slingshot-guidelines.md` | repo root |
| 2 | Local prompt files | `.slingshot/prompts/{problems,skills,hooks,templates}/*.prompt.md` |
| 3 | Agent Skills | `.slingshot/prompts/skills/*.prompt.md` |
| 4 | Agent Hooks | `docs/agent-hooks.md` + `.slingshot/prompts/hooks/*.prompt.md` |
| 5 | `.slingshot.config.js` | repo root |
| 6 | `.slingshot.mcp.json` | repo root |
| 7 | `.ssworkspaceignore` | repo root |
| 8 | README "How I Used Slingshot" | this section |
| 9 | Usage report screenshot | `docs/slingshot-usage-report.md` |
| 10 | PR with AI review comments | `docs/sample-pr-description.md`, using `.slingshot/prompts/templates/code-review-template.prompt.md` |
