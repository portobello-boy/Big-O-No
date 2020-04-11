import sys
import json
import requests

if len(sys.argv) != 4:
    print("Incorrent command line arguments.")
    print("python3 wrapper.py <local|remote> <circuit|expression> <path to JSON file>")
    quit()

url = ""
data = {}
headers = {"Content-Type": "application/json",
           "Accept": "*/*",
           "Connection": "keep-alive"}

if sys.argv[1] == "local":
    url = "http://localhost:3001"
elif sys.argv[1] == "remote":
    url = "http://192.168.50.217:3001"
else:
    print("You did not specify a local or remote server!")
    quit()

if sys.argv[2] == "expression":
    url += "/exp"
elif sys.argv[2] == "circuit":
    url += "/circuit"
else:
    print("You did not specify expression or circuit!")
    quit()

with open(sys.argv[3]) as json_file:
    data = json.load(json_file)

r = requests.post(url=url, data=json.dumps(data), headers=headers)
print(json.dumps(json.loads(r.text), indent=4, sort_keys=False))