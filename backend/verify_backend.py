import requests
import time

BASE_URL = "http://127.0.0.1:5000"

def test_api():
    print("Testing API...")

    # 1. Create Workshop
    print("\n1. Create Workshop")
    new_workshop = {
        "name": "Taller de Python Avanzado",
        "description": "Dominando Flask y SQLAlchemy",
        "date": "2025-07-01",
        "time": "18:00",
        "location": "Sala Virtual 1",
        "category": "Tecnología"
    }
    response = requests.post(f"{BASE_URL}/workshops", json=new_workshop)
    print(f"Status: {response.status_code}")
    if response.status_code != 201:
        print(f"Error Response Body: {response.text}")
    print(f"Response: {response.json()}")
    assert response.status_code == 201
    workshop_id = response.json()['id']

    # 2. Get Workshops
    print("\n2. Get Workshops")
    response = requests.get(f"{BASE_URL}/workshops")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    assert response.status_code == 200
    assert len(response.json()) > 0

    # 3. Get Specific Workshop
    print(f"\n3. Get Workshop {workshop_id}")
    response = requests.get(f"{BASE_URL}/workshops/{workshop_id}")
    print(f"Status: {response.status_code}")
    assert response.status_code == 200
    assert response.json()['name'] == "Taller de Python Avanzado"

    # 4. Update Workshop
    print(f"\n4. Update Workshop {workshop_id}")
    updated_data = new_workshop.copy()
    updated_data['name'] = "Taller de Python Fullstack"
    response = requests.put(f"{BASE_URL}/workshops/{workshop_id}", json=updated_data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    assert response.status_code == 200
    assert response.json()['name'] == "Taller de Python Fullstack"

    # 5. Register Student
    print(f"\n5. Register Student to {workshop_id}")
    student = {
        "name": "Juan Perez",
        "email": "juan@example.com"
    }
    response = requests.post(f"{BASE_URL}/workshops/{workshop_id}/register", json=student)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    assert response.status_code == 201

    # 6. Delete Workshop
    print(f"\n6. Delete Workshop {workshop_id}")
    response = requests.delete(f"{BASE_URL}/workshops/{workshop_id}")
    print(f"Status: {response.status_code}")
    assert response.status_code == 200

    print("\nALL TESTS PASSED! ✅")

if __name__ == "__main__":
    try:
        test_api()
    except Exception as e:
        print(f"\n❌ TEST FAILED: {e}")
