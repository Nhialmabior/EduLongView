from fastapi.testclient import TestClient

from app import main


client = TestClient(main.app)

VALID_PAYLOAD = {
    "requestId": "local-test-0001",
    "learnerContext": {"grade": 5, "classStream": "East"},
    "evidence": {
        "records": [{
            "id": "record-001",
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
            "observation": "Completed calculations with occasional prompting.",
        }]
    },
}


def setup_school_user(monkeypatch, role="teacher"):
    context = {
        "user": {"id": "user-001", "email": "teacher@example.org"},
        "membership": {
            "id": "membership-001",
            "school_id": "school-001",
            "user_id": "user-001",
            "role": role,
            "status": "active",
        },
        "school": {"id": "school-001", "name": "Example School", "status": "active"},
    }
    monkeypatch.setitem(main.app.dependency_overrides, main.require_teacher_token, lambda: context)
    return context


def test_health_endpoint_is_public():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_draft_requires_supabase_authentication(monkeypatch):
    monkeypatch.delenv("SUPABASE_URL", raising=False)
    monkeypatch.setattr(main, "SUPABASE_URL", "")
    monkeypatch.setattr(main, "SUPABASE_PUBLISHABLE_KEY", "")
    monkeypatch.setattr(main, "SUPABASE_SERVICE_ROLE_KEY", "")
    main.app.dependency_overrides.pop(main.require_teacher_token, None)
    response = client.post("/api/v1/reports/draft", json=VALID_PAYLOAD)
    assert response.status_code == 401


def test_auth_me_returns_only_current_school_context(monkeypatch):
    setup_school_user(monkeypatch)
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 200
    assert response.json()["school"]["id"] == "school-001"
    assert response.json()["membership"]["role"] == "teacher"


def test_invitation_activation_requires_authenticated_session():
    main.app.dependency_overrides.pop(main.require_authenticated_user, None)
    response = client.post("/api/v1/auth/activate-invitation")
    assert response.status_code == 401


def test_teacher_cannot_invite_another_teacher(monkeypatch):
    setup_school_user(monkeypatch, role="teacher")
    response = client.post(
        "/api/v1/school/teachers/invite",
        json={"email": "new.teacher@example.org"},
    )
    assert response.status_code == 403


def test_draft_returns_structured_teacher_draft(monkeypatch):
    setup_school_user(monkeypatch)

    async def fake_generator(payload):
        return (
            main.DraftContent(
                performanceSummary="The submitted Mathematics result is 72%.",
                strengths=["A recorded score of 18 out of 25."],
                areasNeedingAttention=[],
                recommendations=["Review the learner's next assessment evidence."],
                evidenceReferences=["record-001"],
                limitations=["Only one assessment record was supplied."],
            ),
            "test-model",
        )

    monkeypatch.setattr(main, "generate_with_model", fake_generator)
    response = client.post("/api/v1/reports/draft", json=VALID_PAYLOAD)
    assert response.status_code == 200
    body = response.json()
    assert body["requestId"] == "local-test-0001"
    assert body["draft"]["evidenceReferences"] == ["record-001"]
    assert body["model"]["name"] == "test-model"
    assert "approval" not in body
    assert "release" not in body


def test_rejects_score_above_maximum(monkeypatch):
    setup_school_user(monkeypatch)
    payload = {
        **VALID_PAYLOAD,
        "evidence": {"records": [{**VALID_PAYLOAD["evidence"]["records"][0], "score": 26}]},
    }
    response = client.post("/api/v1/reports/draft", json=payload)
    assert response.status_code == 422


def test_rejects_duplicate_evidence_ids(monkeypatch):
    setup_school_user(monkeypatch)
    record = VALID_PAYLOAD["evidence"]["records"][0]
    payload = {
        **VALID_PAYLOAD,
        "evidence": {"records": [record, {**record, "assessmentTitle": "Second assessment"}]},
    }
    response = client.post("/api/v1/reports/draft", json=payload)
    assert response.status_code == 422


def test_rejects_unexpected_personal_fields(monkeypatch):
    setup_school_user(monkeypatch)
    payload = {**VALID_PAYLOAD, "learnerName": "A real learner"}
    response = client.post("/api/v1/reports/draft", json=payload)
    assert response.status_code == 422


def test_model_response_cannot_reference_unknown_evidence():
    draft = main.DraftContent(
        performanceSummary="A summary.",
        strengths=[],
        areasNeedingAttention=[],
        recommendations=[],
        evidenceReferences=["record-001", "fabricated-record"],
        limitations=[],
    )
    try:
        main.validate_evidence_references(draft, {"record-001"})
    except ValueError as exc:
        assert "not supplied" in str(exc)
    else:
        raise AssertionError("Unknown evidence reference was not rejected")


def test_model_response_cannot_duplicate_evidence_references():
    draft = main.DraftContent(
        performanceSummary="A summary.",
        strengths=[],
        areasNeedingAttention=[],
        recommendations=[],
        evidenceReferences=["record-001", "record-001"],
        limitations=[],
    )
    try:
        main.validate_evidence_references(draft, {"record-001"})
    except ValueError as exc:
        assert "duplicate" in str(exc)
    else:
        raise AssertionError("Duplicate evidence reference was not rejected")


def test_ai_provider_not_configured_returns_503(monkeypatch):
    setup_school_user(monkeypatch)
    monkeypatch.setattr(main, "AI_API_KEY", "")
    monkeypatch.setattr(main, "AI_MODEL", "")
    response = client.post("/api/v1/reports/draft", json=VALID_PAYLOAD)
    assert response.status_code == 503
    assert "not configured" in response.json()["detail"]
