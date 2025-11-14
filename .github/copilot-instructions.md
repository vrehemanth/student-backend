# Copilot instructions for student-backend

This file gives focused, actionable guidance for AI coding assistants working on this repo. Keep it short and concrete.

- Project layout
  - `server.js` — Express API and static file server. Serves `client/` and exposes REST endpoints under `/students`.
  - `client/` — simple browser UI (`index.html`, `app.js`, `style.css`) that fetches `http://localhost:3000/students`.
  - `models/Student.js` and `models/Counter.js` — Mongoose schemas. `Counter` implements a manual auto-increment `studentId` used by `POST /students`.
  - `Dockerfile` — container image build (Node 18). Image exposes port 3000.
  - `k8s/` — `deployment.yaml` (image `vrehemanth4/student-backend:latest`, 2 replicas) and `service.yaml` (NodePort 32000).

- How to run locally (dev)
  - Install deps: `npm install`
  - Dev server (auto-reload): `npm run dev` (uses `nodemon`)
  - Prod start: `npm run start`
  - The UI is available at `http://localhost:3000` (server serves `client/` folder).

- Tests
  - `npm test` is configured to run `jest`, but no tests are present in the repo. If adding tests use `jest` and `supertest` for API routes.

- Container / k8s workflows
  - Build image: `docker build -t yourname/student-backend:tag .` (Dockerfile uses `node:18`).
  - Kubernetes: `kubectl apply -f k8s/deployment.yaml -f k8s/service.yaml`. Service uses NodePort `32000` (maps to container port 3000).

- Important codebase-specific notes (must be preserved / respected)
  - MongoDB connection is currently hard-coded in `server.js` (MongoDB Atlas connection string). Treat it as a secret: do not leak it in public patches. Prefer replacing with an environment variable (e.g., `process.env.MONGO_URI`) when changing code.
  - Auto-increment behavior: `POST /students` uses `Counter` collection. If no counter exists the code creates `{ name: 'student_counter', value: 1 }`; subsequent creates increment the `value` before assigning it to `studentId`.
  - Client/Server ID mismatch (critical): the browser UI passes the MongoDB `_id` (document id) when calling edit/delete (`editStudent(s._id)` / `deleteStudent(s._id)`), but server routes for update/delete look up documents by the numeric `studentId` field. This is a functional bug — fixes should either:
    - change the client to call endpoints with `studentId` (e.g., include `studentId` in the rendered row and pass that), or
    - update server routes to accept `_id` (ObjectId) in addition to `studentId`.
  - Static assets: `server.js` serves `client/` with `express.static("client")`. When changing client files, no extra routing is needed.

- Common tasks for an AI assistant
  - When modifying DB connection: replace hard-coded string with `process.env.MONGO_URI` and add a short README note on required env vars for local/dev/k8s.
  - When fixing APIs: verify both server routes and the `client/app.js` usage. Unit/integration tests (jest + supertest) are recommended for endpoints: GET /students, POST /students, PATCH/DELETE behavior.
  - When updating k8s manifests: ensure image tag and env var injection for DB credentials (use a `Secret` in k8s to supply `MONGO_URI`). The current `k8s/deployment.yaml` uses the image `vrehemanth4/student-backend:latest`.

- Quick examples
  - Start dev server: `npm install; npm run dev` → open `http://localhost:3000`
  - Build docker image: `docker build -t yourname/student-backend:latest .`
  - Apply k8s manifests: `kubectl apply -f k8s/`

If any of these areas are incomplete or you want me to implement a specific fix (for example: switch to env-based Mongo URI, or repair the client/server ID mismatch and add tests), tell me which and I will open a PR with tests and a short changelog.
