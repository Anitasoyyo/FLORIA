_EMAIL = "test@floria.com"
_PASSWORD = "SecurePass123"
_NOMBRE = "Test User"


def test_register_creates_user(client):
    resp = client.post("/api/v1/auth/register", json={
        "email": _EMAIL,
        "password": _PASSWORD,
        "nombre": _NOMBRE,
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["email"] == _EMAIL
    assert data["nombre"] == _NOMBRE
    assert "id" in data


def test_register_duplicate_email_returns_400(client):
    resp = client.post("/api/v1/auth/register", json={
        "email": _EMAIL,
        "password": _PASSWORD,
        "nombre": _NOMBRE,
    })
    assert resp.status_code == 400


def test_login_returns_token(client):
    resp = client.post("/api/v1/auth/login", json={
        "email": _EMAIL,
        "password": _PASSWORD,
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password_returns_401(client):
    resp = client.post("/api/v1/auth/login", json={
        "email": _EMAIL,
        "password": "wrongpassword",
    })
    assert resp.status_code == 401


def test_get_me_returns_current_user(client):
    token = client.post("/api/v1/auth/login", json={
        "email": _EMAIL,
        "password": _PASSWORD,
    }).json()["access_token"]

    resp = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert resp.json()["email"] == _EMAIL


def test_get_me_without_token_returns_401(client):
    resp = client.get("/api/v1/auth/me")
    assert resp.status_code == 401
