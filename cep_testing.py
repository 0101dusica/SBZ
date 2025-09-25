import requests
import time
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8080/api/tiredness-system"

# 1. Dodavanje sesije
def add_session():
    session_data = {
        "sessions": [
            {
                "id": 1,
                "userId": 100,
                "startTime": datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
                "sessionType": "work",
                "activityEvents": []
            }
        ]
    }
    r = requests.post(f"{BASE_URL}/add", json=session_data)
    print("[ADD SESSION]", r.text)
    return session_data["sessions"][0]["id"]

# 2. Slanje eventa
def send_event(session_id, activity_type, details, intensity=1.0, duration=5, timestamp=None):
    event = {
        "sessionId": session_id,
        "activityType": activity_type,
        "details": details,
        "intensity": intensity,
        "duration": duration
    }
    if timestamp:
        event["timestamp"] = timestamp
    r = requests.post(f"{BASE_URL}/event", json=event)
    print(f"[EVENT {activity_type}]", r.json())
    return r.json()

# 3. Provera preporuka
def get_recommendations(session_id):
    r = requests.get(f"{BASE_URL}/recommendations/{session_id}")
    print("[RECOMMENDATIONS]", r.json())
    return r.json()

# 4. Test Error Pattern Detection
def test_error_pattern(session_id):
    print("\n--- Test: Error Pattern Detection ---")
    for i in range(3):
        send_event(session_id, "ERROR", f"Compilation error {i+1}")
        time.sleep(0.5)
    get_recommendations(session_id)

# 5. Test Frequent Interruptions Pattern
def test_frequent_interruptions(session_id):
    print("\n--- Test: Frequent Interruptions Pattern ---")
    for i in range(5):
        send_event(session_id, "CONTEXT_SWITCH", f"Alt+Tab {i+1}")
        time.sleep(0.5)
    get_recommendations(session_id)

# 6. Test Long Inactivity Pattern
def test_long_inactivity(session_id):
    print("\n--- Test: Long Inactivity Pattern ---")
    now = datetime.now()
    send_event(session_id, "IDLE", "User inactive", timestamp=now.strftime("%Y-%m-%dT%H:%M:%S"))
    # Simuliraj 5 minuta kasnije
    later = now + timedelta(minutes=5)
    send_event(session_id, "IDLE", "User still inactive", timestamp=later.strftime("%Y-%m-%dT%H:%M:%S"))
    get_recommendations(session_id)

# 7. Test Intensive Work Without Break
def test_intensive_work(session_id):
    print("\n--- Test: Intensive Work Without Break ---")
    for i in range(20):
        send_event(session_id, "TYPING", f"Typing {i+1}", intensity=0.8, duration=10)
        time.sleep(0.2)
    get_recommendations(session_id)

if __name__ == "__main__":
    print("\n=== CEP Automated Testing ===\n")
    session_id = add_session()
    test_error_pattern(session_id)
    test_frequent_interruptions(session_id)
    test_long_inactivity(session_id)
    test_intensive_work(session_id)
    print("\n=== Test Complete ===\n")

