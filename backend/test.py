import requests
import base64

url = "http://localhost:8080/wkwk/api/v1/reports/644d7de9ee18a7ad76b8c7f7/activities/644d7e35ee18a7ad76b8c7fb/documents"

read = open("data/japanese_voice.mp3" , "rb")
encoded = base64.b64encode(read.read())
payload = {
    "type": "audio",
    "content": encoded.decode("utf-8")
}
headers = {
    "Content-Type": "application/json"
}
response = requests.request("POST", url, json=payload, headers=headers)


read = open("data/doc_jp1.txt", "rb")
encoded = base64.b64encode(read.read())
payload = {
    "type": "text",
    "content": encoded.decode("utf-8")
}
headers = {
    "Content-Type": "application/json"
}
response = requests.request("POST", url, json=payload, headers=headers)

read = open("data/doc_jp2.txt", "rb")
encoded = base64.b64encode(read.read())
payload = {
    "type": "text",
    "content": encoded.decode("utf-8")
}
headers = {
    "Content-Type": "application/json"
}
response = requests.request("POST", url, json=payload, headers=headers)

read = open("data/doc_jp3.txt", "rb")
encoded = base64.b64encode(read.read())
payload = {
    "type": "text",
    "content": encoded.decode("utf-8")
}
headers = {
    "Content-Type": "application/json"
}
response = requests.request("POST", url, json=payload, headers=headers)

payload = {
    "type": "image",
    "content": encoded.decode("utf-8")
}