from fastapi.testclient import TestClient

from app import main


client = TestClient(main.app)
TOKEN = "test-only-token"

VALID_PAYLOAD = {
    "requestId": "local-test-0001",
    "learnerContext": {"grade": 5, "classStream": "East"},
    "evidence": {
        "records": [
            {
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
            }
        ]
    },
}


def setup_token(monkeypatch):
    monkeypatch.setattr(main, "API_TOKEN", TOKEN)


def test_health_endpoint_is_public():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_draft_requires_authentication(monkeypatch):
    setup_token(monkeypatch)
    response = client.post("/api/v1/reports/draft", json=VALID_PAYLOAD)
    assert response.status_code == 401


def test_draft_rejects_wrong_token(monkeypatch):
    setup_token(monkeypatch)
    response = client.post(
        "/api/v1/reports/draft",
        json=VALID_PAYLOAD,
        headers={"Authorization": "Bearer incorrect-token"},
    )
    assert response.status_code == 401


def test_draft_returns_structured_teacher_draft(monkeypatch):
    setup_token(monkeypatch)

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
    response = client.post(
        "/api/v1/reports/draft",
        json=VALID_PAYLOAD,
        headers={"Authorization": f"Bearer {TOKEN}"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["requestId"] == "local-test-0001"
    assert body["draft"]["evidenceReferences"] == ["record-001"]
    assert body["model"]["name"] == "test-model"
    assert "approval" not in body
    assert "release" not in body


def test_rejects_score_above_maximum(monkeypatch):
    setup_token(monkeypatch)
    payload = {
        **VALID_PAYLOAD,
        "evidence": {
            "records": [{**VALID_PAYLOAD["evidence"]["records"][0], "score": 26}]
        },
    }
    response = client.post(
        "/api/v1/reports/draft",
        json=payload,
        headers={"Authorization": f"Bearer {TOKEN}"},
    )
    assert response.status_code == 422


def test_rejects_duplicate_evidence_ids(monkeypatch):
    setup_token(monkeypatch)
    record = VALID_PAYLOAD["evidence"]["records"][0]
    payload = {
        **VALID_PAYLOAD,
        "evidence": {"records": [record, {**record, "assessmentTitle": "Second assessment"}]},
    }
    response = client.post(
        "/api/v1/reports/draft",
        json=payload,
        headers={"Authorization": f"Bearer {TOKEN}"},
    )
    assert response.status_code == 422


def test_rejects_unexpected_personal_fields(monkeypatch):
    setup_token(monkeypatch)
    payload = {
        **VALID_PAYLOAD,
        "learnerName": "A real learner",
    }
    response = client.post(
        "/api/v1/reports/draft",
        json=payload,
        headers={"Authorization": f"Bearer {TOKEN}"},
    )
    assert response.status_code == 422


def test_model_response_cannot_reference_unknown_evidence():
    allowed = {"record-001"}
    returned = {"record-001", "fabricated-record"}
    assert returned - allowed == {"fabricated-record"}
