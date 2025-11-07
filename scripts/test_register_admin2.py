import json
import urllib.error
import urllib.request

url = "http://127.0.0.1:8000/api/auth/register/"
payload = {
    "username": "admin2",
    "email": "admin2@classavo.org",
    "password": "Password123!",
    "first_name": "Admin",
    "last_name": "Two",
    "role": "instructor",
}

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
