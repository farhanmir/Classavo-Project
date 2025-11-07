import json
import random
import urllib.error
import urllib.request

url = "http://127.0.0.1:8000/api/auth/register/"
username = "user_test_" + str(random.randint(1000, 9999))
payload = {
    "username": username,
    "email": username + "@example.com",
    "password": "Password123!",
    "first_name": "Test",
    "last_name": "User",
    "role": "student",
}

print("Trying username:", username)

data = json.dumps(payload).encode("utf-8")
req = urllib.request.Request(
    url, data=data, headers={"Content-Type": "application/json"}
)
try:
    with urllib.request.urlopen(req) as resp:
        print("STATUS", resp.getcode())
        print(resp.read().decode("utf-8"))
except urllib.error.HTTPError as e:
    print("STATUS", e.code)
    try:
        body = e.read().decode("utf-8")
        print(body)
    except Exception as ex:
        print("Error reading response body:", ex)
except Exception as ex:
    print("Request failed:", ex)
