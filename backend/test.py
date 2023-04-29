import requests
import base64

url = "http://localhost:8080/wkwk/api/v1/reports/644d57b342d1aa1ca0a0af5f/activities/644d57db42d1aa1ca0a0af61/documents"

read = open("data/english_voice.mp3" , "rb")
encoded = base64.b64encode(read.read())
payload = {
    "type": "audio",
    "content": encoded.decode("utf-8")
}
headers = {
    "Content-Type": "application/json"
}
response = requests.request("POST", url, json=payload, headers=headers)


# read = open("data/doc_in1.txt", "rb")
# encoded = base64.b64encode(read.read())
# payload = {
#     "type": "text",
#     "content": encoded.decode("utf-8")
# }
# headers = {
#     "Content-Type": "application/json"
# }
# response = requests.request("POST", url, json=payload, headers=headers)

# read = open("data/doc_in2.txt", "rb")
# encoded = base64.b64encode(read.read())
# payload = {
#     "type": "text",
#     "content": encoded.decode("utf-8")
# }
# headers = {
#     "Content-Type": "application/json"
# }
# response = requests.request("POST", url, json=payload, headers=headers)

# read = open("data/doc_in3.txt", "rb")
# encoded = base64.b64encode(read.read())
# payload = {
#     "type": "text",
#     "content": encoded.decode("utf-8")
# }
# headers = {
#     "Content-Type": "application/json"
# }
# response = requests.request("POST", url, json=payload, headers=headers)

# payload = {
#     "type": "image",
#     "content": encoded.decode("utf-8")
# }