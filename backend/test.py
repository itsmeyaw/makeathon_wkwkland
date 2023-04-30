import requests
import base64

url = "http://localhost:8080/wkwk/api/v1/reports/644e21d79b8e479dd84df30e/activities/644e222d9b8e479dd84df314/documents"

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