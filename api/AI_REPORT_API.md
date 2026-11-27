# EduLongView AI Report API Contract

## Status

This document defines the backend contract for the next implementation phase. It is **not a deployed backend** and does not connect the website to an AI model. The existing browser-based, rule-based report generator remains the active report-generation method until a backend is deployed and configured.

## Purpose

Accept one learner's performance evidence, ask an approved AI model to draft a report, and return structured suggestions for a teacher to review. The API must never approve or release a report.

## Proposed endpoint

`POST /api/v1/reports/draft`

The endpoint must be served over HTTPS. The browser must call this backend only; provider credentials must remain in backend environment variables and must never be committed to GitHub or sent to the browser.

### Request

```json
{
  "requestId": "client-generated-unique-id",
  "learnerContext": {
    "grade": 5,
    "classStream": "East"
  },
  "evidence": {
    "records": [
      {
        "id": "performance-record-id",
        "date": "2026-10-14",
        "learningArea": "Mathematics",
        "assessmentTitle": "Mid-term assessment",
        "assessmentType": "Continuous assessment",
        "year": 2026,
        "term": "Term 3",
        "score": 18,
        "maxScore": 25,
        "percentage": 72,
        "attendance": "Present",
        "participation": "Actively participated",
        "observation": "Completed multi-step calculations with occasional prompting."
      }
    ]
  }
}
```

Do not send learner names, admission numbers, parent contacts, dates of birth, or other direct identifiers to the model. Use pseudonymous evidence IDs. Send only the minimum learner context needed to draft an age-appropriate report.

### Successful response

```json
{
  "requestId": "client-generated-unique-id",
  "draft": {
    "performanceSummary": "A concise summary grounded in the supplied records.",
    "strengths": [
      "A specific observation supported by one or more supplied evidence records."
    ],
    "areasNeedingAttention": [
      "A specific area for teacher review, with cautious wording."
    ],
    "recommendations": [
      "A practical next step that a teacher can consider."
    ],
    "evidenceReferences": ["performance-record-id"],
    "limitations": [
      "A note about missing or insufficient evidence, where applicable."
    ]
  },
  "model": {
    "provider": "configured-provider",
    "name": "configured-model"
  }
}
```

The backend must validate the response against this schema before returning it. All evidence references must match IDs in the request. Empty or unsupported claims must be rejected or removed. If the model cannot support a claim from the supplied evidence, it must state that the evidence is insufficient rather than inventing details.

## Error responses

Use consistent JSON errors and appropriate HTTP status codes:

- `400`: invalid request or invalid evidence structure.
- `401` / `403`: missing or invalid school/user authentication or insufficient permission.
- `413`: request exceeds the configured size limit.
- `422`: model output fails schema or evidence-reference validation.
- `429`: rate limit exceeded.
- `502`: model provider unavailable or returned an unusable response.
- `503`: AI service is not configured or temporarily unavailable.
- `504`: model request timed out.

Do not return provider secrets, raw stack traces, internal prompts, or sensitive learner data in error messages or logs.

## Required backend safeguards

1. Authenticate the requesting teacher and verify that they are authorised for the school and learner.
2. Enforce school-level data isolation on every request.
3. Validate request size, field lengths, numeric ranges and allowed data types.
4. Process one learner at a time; do not accept an unrestricted class-wide export endpoint.
5. Minimise and pseudonymise learner data before sending it to an external model.
6. Do not use learner data for model training unless the school has separately established a lawful, explicit basis and the provider terms permit it.
7. Set request timeouts and per-user/per-school rate limits.
8. Do not log full learner evidence or generated report text by default.
9. Validate every generated statement against supplied evidence references.
10. Return a draft only. The backend must not approve, publish, email or release reports to parents.

## Frontend integration rules

- The browser may store a public backend base URL, but never a model API key or service-role credential.
- The frontend must send only the selected learner's evidence, not the entire LocalStorage database.
- The existing rule-based report remains available if the AI service is not configured or is unavailable.
- AI output must populate a separate draft for teacher review; it must not silently overwrite an existing teacher-edited report.
- Preserve the evidence snapshot alongside the generated draft.
- The teacher must be able to edit and save the report. Approval and parent release remain separate future workflows.

## Before production use

The current project stores learner profiles and performance records in browser LocalStorage. That is not a secure, shared school database and does not provide authenticated school-level access control. Do not use real learner records with an external AI service until the application has a secure database, teacher authentication, school isolation, consent/safeguarding review, and an approved data-processing arrangement.
