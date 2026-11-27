# EduLongView FastAPI backend

This is the first runnable backend scaffold for evidence-grounded learner report drafting.

## Current status

- FastAPI application and health endpoint are implemented.
- `POST /api/v1/reports/draft` validates a single learner's evidence and returns a structured AI draft when a provider is configured.
- The provider adapter uses an OpenAI-compatible Chat Completions API. Provider credentials are read only from backend environment variables.
- AI output is schema-validated and evidence references are checked against the submitted record IDs.
- The API does not approve, publish, email or release reports.
- **Production teacher authentication and school-level learner authorisation are not implemented.**
- The temporary shared bearer token is for local/server-to-server testing only. Never embed it in the public website.
- No database, persistent report storage, audit trail or parent portal is connected yet.

Do not send real learner data to an external model until the school has approved the provider, reviewed data protection/safeguarding requirements, and implemented production authentication and school-level access control.

## Local setup (Windows PowerShell)

From the repository root:

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `.env` and set a long random `EDULONGVIEW_API_TOKEN`. Keep `AI_API_KEY` and `AI_MODEL` empty until an approved provider is selected. Never commit `.env`.

Start the API:

```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Open `http://127.0.0.1:8000/docs` for the interactive API documentation and `http://127.0.0.1:8000/health` for health status.

## Test a request

Use a local terminal or an API client. Do not place the shared token in browser JavaScript.

```powershell
$token = "YOUR_LOCAL_TOKEN"
$headers = @{ Authorization = "Bearer $token" }
$body = @{
  requestId = "local-test-0001"
  learnerContext = @{ grade = 5; classStream = "East" }
  evidence = @{
    records = @(
      @{
        id = "record-001"
        date = "2026-10-14"
        learningArea = "Mathematics"
        assessmentTitle = "Mid-term assessment"
        assessmentType = "Continuous assessment"
        year = 2026
        term = "Term 3"
        score = 18
        maxScore = 25
        percentage = 72
        attendance = "Present"
        participation = "Actively participated"
        observation = "Completed multi-step calculations with occasional prompting."
      }
    )
  }
} | ConvertTo-Json -Depth 8
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/reports/draft" -Method Post -Headers $headers -ContentType "application/json" -Body $body
```

Without `AI_API_KEY` and `AI_MODEL`, the protected draft endpoint intentionally returns HTTP 503. This confirms the backend is not silently generating fabricated AI output.

## Environment variables

| Variable | Purpose |
|---|---|
| `EDULONGVIEW_API_TOKEN` | Temporary local/server-to-server bearer token; not production identity authentication |
| `AI_BASE_URL` | OpenAI-compatible API base URL |
| `AI_API_KEY` | Provider key; backend only |
| `AI_MODEL` | Provider model identifier |
| `AI_TIMEOUT_SECONDS` | Provider request timeout |
| `CORS_ORIGINS` | Exact allowed browser origins |
| `MAX_EVIDENCE_RECORDS` | Maximum evidence rows per request |

## Before connecting the website

1. Implement real teacher sign-in and verify each teacher's school and learner permissions on every request.
2. Use a secure shared database with school-level row access controls; browser LocalStorage is not a production database.
3. Select an AI provider only after reviewing its data-processing terms, retention and training settings.
4. Add audit logging that records actions without logging full learner evidence or report text.
5. Then connect the frontend using a short-lived authenticated teacher session, never the shared bootstrap token.

The rule-based report generator in the static website remains the active workflow until those steps are complete.


## Automated tests

From the `backend/` directory, after installing requirements:

```powershell
python -m pytest -q
```

The tests cover the health route, missing/incorrect authentication, a successful mocked draft, invalid scores, duplicate evidence IDs and rejection of unexpected personal fields. The successful draft test mocks the provider adapter; it does not call a paid AI service.


## School identity and access-control foundation

The first school-identity SQL schema is in `sql/001_school_identity.sql`.

It creates:
- `schools`: one isolated organisation per school.
- `school_memberships`: one user-to-school membership with the roles `school_admin` or `teacher`.
- `school_audit_events`: metadata-only audit trail for administrative actions.
- Row Level Security policies so signed-in users can read only their own membership and school; school administrators can read memberships and audit events for their own school.
- No browser-authenticated INSERT, UPDATE or DELETE permissions on these identity tables. Membership changes must go through the trusted backend after role checks.

**Important setup status:** this repository contains the SQL foundation, but it has not been applied to a Supabase project. The connected Supabase workspace currently has no active EduLongView project. Do not apply this migration to another project's database. A dedicated active EduLongView Supabase project must be selected before enabling sign-in or teacher invitations.

The first school and its first school administrator must be provisioned through a controlled setup process. Public self-assignment of the `school_admin` role is intentionally not permitted.
