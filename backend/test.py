import requests
import base64

url = "http://localhost:8080/wkwk/api/v1/reports/644cfdd3cffd872e2a9f5bee/activities/644cfeb5cffd872e2a9f5bf2/documents"

read = open("data/Leek2_Idle.png", "rb")
encoded = base64.b64encode(read.read())

# payload = {
#     "type": "text",
#     "content": encoded.decode("utf-8")
# }

payload = {
    "type": "image",
    "content": encoded.decode("utf-8")
}


headers = {
    "Content-Type": "application/json"
}

response = requests.request("POST", url, json=payload, headers=headers)