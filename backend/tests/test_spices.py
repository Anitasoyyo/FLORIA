def test_get_spices_returns_200(client):
    resp = client.get("/api/v1/spices")
    assert resp.status_code == 200


def test_get_spices_returns_list(client):
    resp = client.get("/api/v1/spices")
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_spice_has_expected_fields(client):
    spice = client.get("/api/v1/spices").json()[0]
    assert "id" in spice
    assert "nombre" in spice
    assert "precio" in spice
    assert "stock" in spice


def test_search_returns_matching_results(client):
    resp = client.get("/api/v1/spices/search?q=menta")
    assert resp.status_code == 200
    results = resp.json()
    assert len(results) > 0
    assert all("menta" in s["nombre"].lower() for s in results)


def test_search_empty_query_returns_all(client):
    all_spices = client.get("/api/v1/spices").json()
    search_resp = client.get("/api/v1/spices/search?q=").json()
    assert len(search_resp) == len(all_spices)


def test_search_no_match_returns_empty(client):
    resp = client.get("/api/v1/spices/search?q=zzznomatch999")
    assert resp.status_code == 200
    assert resp.json() == []
