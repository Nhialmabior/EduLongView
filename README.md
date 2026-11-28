# EduLongView

**See the progress. Understand the patterns. Support every learner.**

EduLongView is an AI-assisted learner performance monitoring and reporting platform designed to help schools organise learner records, understand progress over time, identify learners who may need additional support, and prepare clear, evidence-based reports.

The project brings learner information and teacher-recorded evidence into one workspace. Instead of treating a single test result as the full picture, EduLongView is designed around longitudinal records: assessment results, attendance, participation and factual teacher observations collected across reporting periods.

> **Core principle:** AI supports teachers; it does not replace them. AI-generated content remains a draft for teacher review. A teacher or authorised school official remains responsible for decisions, approval and any report release.

**Project status:** Presentation-ready browser demonstration with a separate backend foundation under development. It is a prototype, not yet a production school information system.

---

## Project links

| Resource | Link |
|---|---|
| Live website | [Open EduLongView](https://nhialmabior.github.io/EduLongView/) |
| GitHub repository | [Nhialmabior/EduLongView](https://github.com/Nhialmabior/EduLongView) |
| Backend API documentation (when the service is available) | Open the deployed API's `/docs` route |

The live website is intended for demonstration and evaluation. It uses synthetic sample data; do not enter real learner or school records.

---

## The problem

Learner performance information is often recorded in separate files, mark sheets and teacher notes. This can make it difficult to:

- Follow an individual learner's progress across terms.
- Bring assessment results, attendance and observations together.
- Notice repeated patterns that may require teacher attention.
- Prepare consistent, understandable learner reports.
- Keep reporting decisions under the control of teachers and school staff.

EduLongView explores how a structured digital workspace and carefully bounded AI assistance can make these tasks easier while keeping professional judgement with educators.

## Project objectives

- Organise learner profiles and individual performance evidence.
- Support manual entry and bulk import of assessment records.
- Present recorded performance in readable summaries and charts.
- Surface explainable indicators that prompt teacher review.
- Prepare learner report drafts grounded in available evidence.
- Keep teacher review and parent/guardian release as separate, controlled steps.
- Provide a responsive interface that can be explored on desktop, tablet and mobile devices.

## Key features

### 1. Dashboard

The dashboard provides a school-workspace overview, including learner and assessment indicators, performance visualisations and shortcuts to key areas. Academic year and term selectors help organise the displayed information by reporting period.

### 2. Learner directory

- Register and manage learner profiles.
- Organise learners by grade and class/stream.
- Search and filter learner records.
- Link performance evidence to the relevant learner.
- Use admission or learner identifiers to help prevent duplicate records.

### 3. Individual performance records

Teachers can record evidence for an individual learner, including:

- Learning area or subject.
- Assessment title and type.
- Academic year, term and date.
- Score and maximum score.
- Attendance and participation context.
- Factual teacher observations.

The interface validates score entries and calculates percentages where numeric scores are provided. Evidence is associated with the learner and reporting period.

### 4. Bulk upload

The demonstration includes a bulk-import workflow for supported CSV and Excel (.xlsx) files.

- Use a template to prepare records.
- Upload a file and preview the rows.
- Validate learner identifiers and score values.
- Review invalid or duplicate rows before confirming the import.
- Add accepted records to the browser demonstration workspace.

### 5. Analytics and performance insights

Charts and summaries help users explore recorded evidence across learning areas and reporting periods. The aim is to make patterns easier to review while keeping the underlying records visible and understandable.

### 6. Learners to review

Explainable, rule-based indicators can draw attention to records that may need follow-up, such as repeated low results, declining performance, missing evidence or attendance concerns.

These indicators are prompts for professional review. They are not diagnoses, final judgements or automated decisions about a learner.

### 7. AI-assisted report drafts

EduLongView's intended reporting workflow brings together available learner evidence to prepare a readable report draft with:

- A performance summary.
- Identified strengths.
- Areas that may need attention.
- Suggested support actions.
- References to the evidence used and any limitations.

The browser demonstration includes an evidence-based report workflow. The separate API provides a foundation for provider-backed AI drafting when correctly configured. Do not describe the current public demo as a fully connected live AI service.

### 8. Report management and parent release

The workspace includes reporting and parent-release areas to demonstrate the intended separation between preparing a report, reviewing it and making it available to a parent or guardian.

The production workflow must ensure that only an authorised school user can approve and release a report, and that a parent or guardian can access only reports explicitly released for a learner linked to them through a verified school process. A complete end-to-end parent portal and release system is not yet represented as production-ready.

### 9. Demo data and workspace controls

Synthetic demonstration learners and performance records allow reviewers to explore the interface without first creating a dataset. The workspace also includes controls for managing or resetting the local demonstration state.

**Demo data is illustrative only.** It does not represent real learners, school results or operational school records.

### 10. Responsive interface

The interface includes a responsive navigation shell and layouts designed to adapt to desktop, tablet and mobile screen widths. Mobile navigation and page layouts are intended to keep the workspace usable on smaller screens, including modern iPhone-sized displays.

The current project is a responsive website. It is not yet a published native mobile application or a fully offline-capable Progressive Web App (PWA).

---

## Technology stack

| Layer | Technologies |
|---|---|
| Frontend | HTML5, CSS3, vanilla JavaScript |
| Charts and visualisation | Chart.js |
| Icons | Lucide |
| CSV import | PapaParse |
| Excel import | SheetJS |
| PDF/report support | jsPDF |
| Backend | Python, FastAPI, Pydantic, Uvicorn |
| Authentication foundation | Supabase Auth |
| Database foundation | Supabase / PostgreSQL with Row Level Security policies |
| AI integration foundation | OpenAI-compatible API configuration |
| Backend testing | Pytest |
| Frontend hosting | GitHub Pages |
| Backend hosting configuration | Render |

The frontend is a static website and does not currently require a JavaScript build step. Some libraries are loaded from CDNs, so an internet connection is needed for those external resources to load.

## How the project works

The intended learner-reporting workflow is:

1. Register a learner in the school workspace.
2. Record or import the learner's performance evidence.
3. Review summaries, charts and indicators generated from the available records.
4. Prepare a report draft using the selected learner's evidence.
5. Have a teacher review and edit the draft.
6. Obtain the required school approval.
7. Release the approved report through a verified parent/guardian process.

The prototype demonstrates parts of this workflow in the browser. The complete secure, multi-user workflow requires further backend and database integration.

---

## Architecture and implementation status

EduLongView has two main parts:

### Browser frontend

The public demonstration is a static HTML, CSS and JavaScript application. Its current demonstration records are stored in the browser using LocalStorage.

This means:

- Data belongs to the browser profile and device being used.
- Records are not automatically shared between teachers or devices.
- Clearing browser site data can remove locally stored demonstration records.
- Browser storage does not provide the access controls or security required for real learner records.

### Backend foundation

A separate FastAPI service provides the foundation for authenticated school workflows and report drafting. It includes API validation, Supabase session checks, school-membership checks for protected operations, teacher invitation logic and a report-draft endpoint designed to return teacher-reviewable output.

The backend is not yet the shared persistence layer for all data entered in the public browser demonstration. A configured AI provider is also required before provider-backed report generation can operate.

### Implementation summary

| Component | Status |
|---|---|
| Responsive static website and workspace navigation | Implemented in the demonstration |
| Dashboard and visual analytics | Implemented in the demonstration |
| Learner directory and synthetic demo learners | Implemented in the demonstration |
| Individual performance evidence entry | Implemented in the demonstration |
| CSV and Excel import workflow | Implemented in the demonstration |
| Evidence-based browser summaries and report workflow | Implemented in the demonstration |
| Explainable learner-review indicators | Demonstration functionality |
| Report management and parent-release interface areas | Present in the workspace; full secure workflow remains future work |
| FastAPI backend | Implemented as a separate service foundation |
| Supabase authentication and school-membership checks | Backend foundation implemented; deployment configuration and full onboarding require validation |
| Shared, school-scoped learner and assessment persistence | Not yet fully integrated with the browser application |
| Live provider-backed AI reporting | Requires provider configuration and end-to-end integration |
| Verified parent/guardian portal and release | Not yet complete end to end |
| Native mobile application / full offline PWA | Not yet implemented |

---

## Repository structure

The main project structure is organised as follows:

```text
EduLongView/
├── index.html
├── README.md
├── render.yaml
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── app.js
│   │   ├── data.js
│   │   └── navigation.js
│   ├── icons/
│   │   ├── favicon.svg
│   │   └── logo-mark.svg
│   └── images/
├── api/
│   └── AI_REPORT_API.md
└── backend/
    ├── app/
    │   └── main.py
    ├── tests/
    │   └── test_api.py
    ├── sql/
    ├── .env.example
    ├── requirements.txt
    └── README.md
```

Key files:

- `index.html` — application shell and page structure.
- `assets/css/style.css` — visual design, layout and responsive styling.
- `assets/js/data.js` — demonstration data, browser persistence and data helpers.
- `assets/js/navigation.js` — navigation, workspace modules and interaction handling.
- `assets/js/app.js` — application initialisation and dashboard behaviour.
- `backend/app/main.py` — FastAPI application and API routes.
- `backend/tests/test_api.py` — backend API tests.
- `backend/.env.example` — example environment-variable names; contains no production secrets.
- `api/AI_REPORT_API.md` — report API contract and integration guidance.
- `render.yaml` — Render deployment blueprint.

---

## Run the frontend locally

### Requirements

- A modern web browser.
- Git.
- Visual Studio Code (recommended).
- VS Code Live Server or another static HTTP server.

### Setup

Clone the repository:

```bash
git clone https://github.com/Nhialmabior/EduLongView.git
cd EduLongView
```

Open the folder in Visual Studio Code:

```bash
code .
```

Open `index.html` with the Live Server extension, or serve the repository root using another static HTTP server.

No frontend package installation or build command is currently required.

### Demonstration workspace

Open the live website or run it locally to explore the synthetic sample workspace. Use the dashboard navigation to visit the learner directory, performance records, bulk upload, analytics and reporting areas.

The browser demonstration stores state in LocalStorage. It is not a shared online database.

---

## Run the backend locally

### Requirements

- Python 3.10 or a compatible version supported by the dependencies.
- A Supabase project for the authentication configuration.
- An AI provider account and API key only if testing provider-backed report drafting.

From the repository root, run:

**Windows PowerShell**

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

**macOS / Linux**

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
cp .env.example .env
```

Configure the environment variables in `.env` using your own service credentials:

| Variable | Purpose |
|---|---|
| `APP_ENV` | Runtime environment |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key or supported anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only Supabase service-role/secret key |
| `AI_BASE_URL` | OpenAI-compatible provider base URL |
| `AI_API_KEY` | Server-side AI provider credential |
| `AI_MODEL` | Configured model identifier |
| `AI_TIMEOUT_SECONDS` | AI request timeout |
| `CORS_ORIGINS` | Explicitly permitted frontend origins |
| `MAX_EVIDENCE_RECORDS` | Maximum evidence records accepted per report request |

Start the API:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Local endpoints:

- Health check: http://127.0.0.1:8000/health
- Interactive API documentation: http://127.0.0.1:8000/docs

See [backend/README.md](backend/README.md) for backend-specific setup details.

**Security:** Never commit `.env` files, expose service-role keys, or place AI provider credentials in frontend JavaScript.

---

## API overview

The backend foundation includes the following routes:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Service health check |
| GET | `/api/v1/auth/me` | Return the authenticated user's school context |
| POST | `/api/v1/auth/activate-invitation` | Activate the signed-in user's confirmed teacher invitation |
| POST | `/api/v1/school/teachers/invite` | Invite a teacher through an authorised school administrator |
| POST | `/api/v1/reports/draft` | Request a teacher-reviewable report draft |

The report endpoint is for draft generation only. It does not approve, publish, email or release reports. The browser demonstration is not yet fully integrated with the backend reporting workflow.

See [api/AI_REPORT_API.md](api/AI_REPORT_API.md) for request and response details.

---

## Deployment

### Frontend — GitHub Pages

The frontend is published as a static website through GitHub Pages.

For deployment from the repository:

1. Open the repository's **Settings**.
2. Open **Pages**.
3. Select the intended publishing source and branch.
4. Use the repository root as the publishing folder when deploying from the root.
5. Save the configuration and wait for the Pages deployment to complete.

The live demonstration is available at:

https://nhialmabior.github.io/EduLongView/

### Backend — Render

A Render blueprint is provided in `render.yaml`. The service uses the backend directory, installs dependencies from `requirements.txt`, and starts the FastAPI application with Uvicorn.

Configure the required environment variables in Render. Set `CORS_ORIGINS` to the exact frontend origin(s) that should be permitted. Check the deployed health endpoint and service logs before relying on the API.

A successful health check confirms that the API process responds; it does not establish that the full application, authentication, AI provider, database persistence or parent-release workflow is production-ready.

---

## Privacy, safeguarding and responsible AI

EduLongView is intended for an education context, where learner information must be handled carefully.

**Do not enter real learner information into the public demonstration.** The browser frontend currently uses LocalStorage for its demonstration records. This is not encrypted, centralised school storage and does not enforce multi-user or school-level access control.

Before using the system with real learners, the project requires:

- Secure school onboarding and controlled first-administrator provisioning.
- Fully tested authentication, role assignment and teacher invitation processes.
- School-scoped database persistence for learner profiles and performance evidence.
- Server-enforced school membership and role permissions for every protected operation.
- Appropriate audit records for sensitive access, edits, approvals and releases.
- Verified parent/guardian linking and consent procedures.
- Parent access restricted to reports explicitly released for their verified learner link.
- Protection of AI drafts and internal teacher notes from unauthorised access.
- Data minimisation and pseudonymisation before sending evidence to an external AI provider.
- Review of AI provider data retention, model-training and data-processing terms.
- Validation of AI output against source evidence, with evidence references retained.
- Security testing, monitoring, rate limits, secure secret management and backup procedures.
- School safeguarding, privacy and applicable data-protection reviews.

AI-generated summaries must not invent results, infer medical or psychological diagnoses, or present unsupported conclusions. A warning or performance indicator should prompt a teacher to review the evidence; it must not label a learner or make a final decision.

---

## Tests

Run the backend tests from the repository root:

```bash
cd backend
python -m pytest -q
```

These tests exercise the backend behaviours covered by the test suite. They do not, by themselves, verify a live Supabase project, external AI provider, email delivery, hosting configuration or the complete end-to-end application.

---

## Roadmap

The next development phases are:

1. Complete school onboarding and secure first-administrator provisioning.
2. Connect the frontend to authenticated school accounts and backend APIs.
3. Move learner profiles and performance records into school-scoped database tables.
4. Connect manual entry and bulk import to secure backend persistence.
5. Integrate the report-drafting API with selected learner evidence.
6. Complete teacher review, approval and report version history.
7. Implement verified parent/guardian linking and controlled report release.
8. Add comprehensive audit trails, safeguarding checks and end-to-end security testing.
9. Evaluate offline support and a Progressive Web App or dedicated mobile application.

## Project boundaries

EduLongView is focused on learner performance evidence, analysis and reporting. It is not intended to become a curriculum repository, lesson-delivery platform or automated assessment authority.

The project will continue to prioritise:

- Evidence-based reporting.
- Teacher oversight and professional judgement.
- Clear, explainable indicators.
- Privacy and safeguarding.
- Responsible and transparent AI assistance.
- Usability across device sizes.

---

## Acknowledgement

EduLongView is developed as an education technology prototype exploring how digital tools and responsible AI can support teachers in understanding learner progress and preparing better-informed reports.

## License

No open-source license has been specified in this repository. Unless a license is added, the project remains subject to the repository owner's rights.
