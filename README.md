# EduLongView

**See the progress. Understand the patterns. Support every learner.**

EduLongView is an AI-assisted learner performance analysis and reporting platform for schools. It helps teachers organise individual learner performance evidence, understand patterns over time, prepare clear reports and recommendations, and share approved reports with parents or guardians through a controlled process.

The central workflow is:

1. A school registers its learners.
2. Teachers enter or import performance evidence for each learner.
3. EduLongView organises the evidence and summarises performance patterns.
4. An AI service can prepare a report draft from the selected learner's evidence.
5. A teacher reviews, corrects and approves the report.
6. An authorised school workflow releases the approved report to the verified parent or guardian.

**The teacher remains responsible for professional judgement and report approval. AI must never approve or release a report.**

EduLongView is designed with refugee and host-community school contexts in mind, including schools in Kakuma and Kalobeyei, Turkana County, Kenya.

---

## 1. Product scope and principles

EduLongView focuses on recording and analysing learner performance. It is **not** a curriculum repository, teaching platform, lesson-planning tool or automated assessment authority. It does not teach curriculum content or decide what a learner should be taught.

- **Learner coverage:** Grades 1–9. Grade information is used to organise learner records and reports; it does not represent curriculum content.
- **Evidence-led analysis:** Summaries and recommendations must be grounded in the learner's recorded results, attendance, participation and factual teacher observations.
- **Individual reporting:** Reports are prepared for one learner at a time, using that learner's available evidence.
- **Human review:** AI output is a draft. Teachers must review and edit it before any approval or release.
- **Parent privacy:** Parents or guardians should only see reports explicitly released for a learner linked to them through a verified school process.
- **School separation:** Each school's users and records must be isolated by server-enforced school membership and database permissions.
- **Data minimisation:** Only the minimum necessary, preferably pseudonymised, evidence should be sent to an external AI provider.
- **No unsupported conclusions:** The system must not invent results, infer diagnoses, or describe a trend from a single observation.

## 2. Current implementation status

EduLongView is under active development. The repository contains a working browser-based demonstration and a separate FastAPI backend foundation.

| Area | Current status |
|---|---|
| Static web workspace | Implemented; HTML, CSS and JavaScript with no frontend build step |
| Dashboard and navigation | Implemented, including responsive navigation and workspace modules |
| Learner directory | Browser-demo implementation with learner profiles and search/filter controls |
| Performance entry | Browser-demo implementation for individual learner evidence |
| Bulk upload | CSV and Excel (.xlsx) import workflow with preview and validation |
| Analysis and report drafts | Rule-based, evidence-based browser workflow |
| Sample workspace data | Synthetic demonstration learners and performance records |
| FastAPI service | Implemented separately from the static frontend |
| Supabase authentication foundation | Backend validates Supabase Auth sessions and resolves active school membership |
| Teacher invitation endpoints | School-admin-only invitation and invitation-activation endpoints are implemented in the backend |
| AI provider | Not configured; the report API intentionally returns HTTP 503 when no provider is configured |
| Shared learner/report database | Not yet implemented for the browser workflow |
| Parent/guardian portal and report release | Not yet implemented end to end |
| Production readiness | Not ready for real learner data; see [Security, privacy and production readiness](#10-security-privacy-and-production-readiness) |

The backend has been deployed to Render and its health endpoint was previously verified. Deployment availability and configuration can change. The static website's current report workflow remains browser-based and rule-based; it is not yet connected to a live AI provider.

## 3. Features in the browser demonstration

### Dashboard and workspace navigation

- Dashboard overview and learner-performance workspace.
- Navigation for Dashboard, Learners, Performance Records and Bulk Upload.
- Insight and reporting areas for Analytics, Learners to Review, AI Report Drafts and Report Management.
- Responsive desktop and mobile navigation.
- School/workspace context and academic year/term selectors.

### Learner directory

- Register learner name, admission/learner number, grade and class/stream.
- Use Grades 1–9 as organisational information.
- Search and filter the learner directory.
- Identify whether learner records have performance evidence available.
- Validate admission/learner numbers to reduce duplicate registrations.

### Individual performance records

Teachers can record evidence against a registered learner, including:

- Learning area or subject label.
- Assessment or activity title and assessment type.
- Academic year, term and date.
- Score and maximum score.
- Attendance and participation.
- Factual teacher observation.

The interface validates score values and calculates the percentage from the score and maximum score. Records are associated with a learner and can be used by the analysis and report-draft workflow.

### Bulk performance upload

- Import multiple records from CSV files or Excel workbooks (.xlsx).
- Download and use the CSV template for the expected fields.
- Match imported rows to learners using their admission/learner number.
- Preview and validate rows before confirming an import.
- Exclude invalid rows and skip detected duplicate assessment records.
- Save accepted imports into the same browser-side performance-record collection used by manual entry.

CSV parsing uses PapaParse and Excel workbook parsing uses SheetJS, loaded from CDN libraries. An internet connection is therefore required for those import libraries to load.

### Analytics and learner report drafts

- Summarise recorded performance by learning area.
- Calculate record counts, mean recorded percentages and first-to-latest changes when repeated scored records exist.
- Summarise available attendance and participation entries.
- Keep teacher observations alongside their source records.
- Show the evidence snapshot used to prepare a report draft.
- Avoid describing a trend when only one scored record is available.
- Keep generated reports as private, editable drafts in the browser demonstration.

**Important:** the current browser report generator is rule-based. It is not a live generative AI integration. The separate backend contains an AI-draft endpoint, but a provider must be configured and the frontend integration and production safeguards must be completed before AI-generated reports can be used in the application.

### Demonstration data

The browser demonstration includes synthetic sample learner profiles and performance records so the workspace can be explored without entering data first. This data is illustrative only. Do not treat it as real school data, and do not use real learner information in the demonstration environment.

The browser application uses the LocalStorage key `edulongview_state_v2`. Resetting the demo workspace restores its default demonstration dataset.

## 4. Technology and architecture

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript
- Browser LocalStorage for the current demonstration state
- PapaParse for CSV import
- SheetJS for Excel workbook import

The frontend is a static website. It does not require npm, a bundler or a frontend build command.

### Backend

- Python
- FastAPI
- Pydantic request/response validation
- Uvicorn ASGI server
- HTTPX for outbound HTTP requests
- python-dotenv for local environment configuration
- Pytest for backend tests

The backend is a separate service. Its authentication and report endpoints do not mean that the static browser application has already migrated its learner data to a shared database.

### Authentication and database foundation

The backend uses Supabase Auth to validate access tokens and resolves the user's active school membership on the server. School identity and membership tables use Row Level Security (RLS). Server-only Supabase credentials belong in backend environment variables and must never be exposed in frontend code.

### AI provider integration

The backend supports an OpenAI-compatible API configuration through server-side environment variables. It validates structured model output and checks that evidence references correspond to records supplied in the request. If no provider is configured, the endpoint returns HTTP 503 rather than creating fabricated AI output.

---

## 5. Repository structure

The main repository layout is:

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
│       └── README.md
├── pages/
│   └── README.md
├── api/
│   └── AI_REPORT_API.md
└── backend/
    ├── app/
    │   ├── __init__.py
    │   └── main.py
    ├── tests/
    │   └── test_api.py
    ├── sql/
    ├── .env.example
    ├── requirements.txt
    └── README.md
```

Key files:

- `index.html`: application page and workspace shell.
- `assets/css/style.css`: layout, visual styles and responsive behaviour.
- `assets/js/data.js`: browser demo data, LocalStorage persistence and data-store helpers.
- `assets/js/navigation.js`: workspace navigation, module rendering and browser interaction handlers.
- `assets/js/app.js`: application startup and dashboard-level behaviour.
- `backend/app/main.py`: FastAPI application, authentication dependencies and API routes.
- `backend/tests/test_api.py`: backend API tests.
- `backend/.env.example`: names and examples of backend configuration variables; it must not contain real secrets.
- `api/AI_REPORT_API.md`: report API request/response contract and integration safeguards.
- `render.yaml`: Render service blueprint.

---

## 6. Run the frontend locally

### Requirements

- A modern browser.
- Visual Studio Code (recommended).
- VS Code Live Server extension, or another static HTTP server.
- Internet access if you want to use CSV/Excel import libraries loaded from CDNs.

### Steps

1. Clone the repository:

   ```powershell
   git clone https://github.com/Nhialmabior/EduLongView.git
   ```

2. Open the project folder:

   ```powershell
   cd EduLongView
   code .
   ```

3. In VS Code, open `index.html` and choose **Open with Live Server**.

You can also serve the folder with another static HTTP server. No frontend package installation or build step is currently required.

### Browser data

The demonstration saves its state in the browser's LocalStorage under `edulongview_state_v2`. This means:

- Data is specific to the browser profile and device.
- Different teachers or devices do not share the same records.
- Clearing browser site data can remove the demonstration records.
- LocalStorage is not a secure school database and must not be used for real learner records.

---

## 7. Run the FastAPI backend locally

The backend runs separately from the static frontend.

### Requirements

- Python 3.10 or later (use a version supported by the installed dependencies).
- Windows PowerShell, macOS Terminal or Linux shell.
- A Supabase project with the required Auth and database configuration.

### Windows PowerShell setup

From the repository root:

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Configure the values in `backend/.env`:

| Variable | Purpose |
|---|---|
| `APP_ENV` | Runtime environment |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key (or supported legacy anon key) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only Supabase service-role/secret key with required permissions |
| `AI_BASE_URL` | OpenAI-compatible provider base URL |
| `AI_API_KEY` | Server-side AI provider credential |
| `AI_MODEL` | Model identifier used by the configured provider |
| `AI_TIMEOUT_SECONDS` | AI request timeout |
| `CORS_ORIGINS` | Explicitly allowed frontend origins |
| `MAX_EVIDENCE_RECORDS` | Maximum evidence records accepted for a report request |

Use the actual values from your own project settings. Never commit a real `.env` file, publish a service-role key, or put AI credentials in frontend JavaScript.

Start the backend:

```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Local endpoints:

- Health check: http://127.0.0.1:8000/health
- Interactive API documentation: http://127.0.0.1:8000/docs

For the full backend setup, see [backend/README.md](backend/README.md).

---

## 8. API overview

The backend currently provides these routes:

| Method | Endpoint | Purpose / access |
|---|---|---|
| GET | `/health` | Public service health check |
| GET | `/api/v1/auth/me` | Return the signed-in user's active school context |
| POST | `/api/v1/auth/activate-invitation` | Activate the signed-in user's own confirmed teacher invitation |
| POST | `/api/v1/school/teachers/invite` | Invite a teacher; active school administrator only |
| POST | `/api/v1/reports/draft` | Request a teacher-reviewable report draft; signed-in active school member |

The invitation endpoint accepts the teacher's email address. The server determines the school and role from the authenticated administrator's membership; the caller cannot choose a school or grant themselves a role.

The report endpoint is draft-only. It does not approve, publish, email or release learner reports. The browser-based report workflow is not yet fully integrated with this backend.

See [api/AI_REPORT_API.md](api/AI_REPORT_API.md) for the report payload contract, error handling and AI integration safeguards.

---

## 9. Deployment

### Static frontend

The frontend can be hosted on any static web host, including GitHub Pages or Netlify:

1. Connect the GitHub repository to the hosting provider, or publish the static project folder.
2. Set the publish/root directory to the repository root.
3. No build command is required.
4. Confirm that `index.html` loads and that static asset paths resolve correctly.

### FastAPI backend on Render

A Render blueprint is included in `render.yaml`. It defines a Python web service with:

- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Health-check path: `/health`

Set the required environment variables in the Render service dashboard. Keep Supabase service-role credentials and AI provider credentials private. Set `CORS_ORIGINS` to the exact frontend origins that should be allowed; do not use an unrestricted wildcard for a production deployment.

The previously configured Render service has used this health URL:

https://edulongview.onrender.com/health

Check the live health endpoint and Render deployment logs before relying on the service. A successful health response confirms that the API process is responding; it does not prove that authentication, AI generation, database persistence or the complete application workflow is production-ready.

---

## 10. Security, privacy and production readiness

**Do not use real learner data in the current browser demonstration.** The frontend currently stores learner profiles, performance records and report drafts in LocalStorage. LocalStorage is not encrypted school storage, is not shared between users and does not enforce school-level access control.

Before production use, complete and test at least the following:

- Provision the first school administrator through a controlled process.
- Complete and test teacher invitation acceptance and account activation.
- Connect the frontend to authenticated backend APIs rather than relying on browser-only state.
- Implement school-scoped learner, performance-record and report storage in the database.
- Enforce school membership and role permissions on every protected operation.
- Add complete audit events for sensitive access, edits, approvals and releases.
- Implement verified parent/guardian linking and consent/verification processes.
- Ensure parents can access only reports explicitly released for their linked learner.
- Keep AI drafts and internal teacher notes private from parents.
- Minimise and pseudonymise evidence sent to an AI provider; do not send direct identifiers unless a reviewed, lawful need exists.
- Review provider retention, training, data-processing and cross-border transfer terms.
- Validate AI output against source evidence and preserve the evidence snapshot.
- Add rate limits, request-size limits, secure secret management, monitoring and security tests.
- Complete school safeguarding, privacy and data-protection reviews applicable to the deployment context.

The initial school and first school administrator still require controlled provisioning. The backend authentication foundation is not a substitute for completing the full school onboarding and data-access workflow.

---

## 11. Backend tests

From the repository root:

```powershell
cd backend
python -m pytest -q
```

The existing tests exercise backend API behaviour with mocked authentication context. They do not prove that a live Supabase project, email delivery, Render deployment, external AI provider or end-to-end browser workflow is functioning.

---

## 12. Development priorities

The next development phases should focus on completing the product workflow without expanding into curriculum delivery:

1. Finish secure school onboarding and first-administrator provisioning.
2. Connect teacher sign-in and school membership to the frontend.
3. Move learner profiles and performance records from LocalStorage into school-scoped database tables.
4. Connect manual entry and bulk upload to authenticated backend persistence.
5. Integrate the report-draft endpoint with the selected learner's minimum necessary evidence.
6. Add teacher review, approval and report version history.
7. Implement verified parent/guardian linking and controlled report release.
8. Complete audit coverage, safeguarding review and end-to-end security testing.

---

## 13. Project boundaries

To preserve the purpose of EduLongView:

- Do not add curriculum repositories, curriculum content or lesson delivery features.
- Do not make AI the final decision-maker for learner outcomes.
- Do not generate claims that are not supported by recorded evidence.
- Do not expose AI drafts or internal notes to parents by default.
- Do not treat browser LocalStorage as secure, centralised or multi-school storage.
- Do not use real learner data until the production safeguards above are complete.

---

## License

No license has been specified for this repository yet. All rights remain with the repository owner unless a license is added.
