# EduLongView FastAPI backend

The backend verifies Supabase Auth sessions, resolves each user's active school membership, permits school administrators to invite teachers, and generates teacher-reviewable report drafts. It does not approve or release reports.

## Authentication and school access

- Browser users sign in through Supabase Auth and send their short-lived access token as `Authorization: Bearer <access_token>`.
- FastAPI validates the token against the Supabase Auth `/auth/v1/user` endpoint. It does not trust browser-supplied role or school identifiers.
- The backend resolves the authenticated user's active membership and verifies that the associated school is active.
- `GET /api/v1/auth/me` returns the authenticated user's own school context.
- `POST /api/v1/school/teachers/invite` is restricted to an active `school_admin`. The server creates a Supabase Auth invitation and an `invited` teacher membership in that administrator's school.
- `POST /api/v1/auth/activate-invitation` activates only the signed-in user's own pending invitation, and only after Supabase confirms the invited email address.
- Teacher invitations are never allowed to choose a school or role in the request body.
- The Supabase service-role/secret key is used only by the backend. Never expose it to the browser.
- Membership and school tables have RLS enabled. Browser clients have no write permissions on these identity tables.

The first school and first school administrator still require controlled provisioning. Do not create an open public endpoint that lets visitors assign themselves the `school_admin` role. The next setup step is to provision the initial school administrator securely, then complete invitation acceptance and account activation.

## Configure locally (Windows PowerShell)

From the repository root:

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Set these values in `.env` using the Supabase project credentials:

- `SUPABASE_URL`: project URL.
- `SUPABASE_PUBLISHABLE_KEY`: publishable key (or legacy anon key).
- `SUPABASE_SERVICE_ROLE_KEY`: server-only service_role key or secret key with the required Auth Admin and Data API permissions.

Never put the server-only key in the website, GitHub, or a public environment variable. Keep AI provider credentials server-side too.

Start the API:

```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Open `http://127.0.0.1:8000/docs` for API documentation and `http://127.0.0.1:8000/health` for health status.

## Endpoints

| Method | Endpoint | Access |
|---|---|---|
| GET | `/health` | Public health check |
| GET | `/api/v1/auth/me` | Signed-in active school member |
| POST | `/api/v1/auth/activate-invitation` | Signed-in user with a confirmed invited email |
| POST | `/api/v1/school/teachers/invite` | Active school administrator only |
| POST | `/api/v1/reports/draft` | Signed-in active school member |

The report API remains draft-only. It does not approve, publish, email, or release learner reports.

## Teacher invitation request

Send only an email address. School and role are resolved on the server from the administrator's verified membership.

```json
{
  "email": "teacher@example.org"
}
```

The invitation email delivery depends on Supabase Auth email settings. Supabase's built-in SMTP is intended for testing and has delivery restrictions; configure a production SMTP provider before inviting real staff.

## AI provider configuration

Keep `AI_API_KEY` and `AI_MODEL` empty until the school approves a provider and reviews its data-processing terms, retention and training settings. Without a configured provider, the draft endpoint intentionally returns HTTP 503 rather than fabricating AI output.

## Tests

From `backend/`:

```powershell
python -m pytest -q
```

Tests use a mocked authenticated school context; they do not call Supabase or a paid AI service. Before real learner data is used, complete initial-admin provisioning, invitation acceptance/activation, school-scoped learner and report storage, audit coverage, and a full security review.
