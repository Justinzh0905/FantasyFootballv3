import requests


payload = {
    'players': ['Stefon Diggs', 'Tyreek Hill', 'CeeDee Lamb'],
    'stat' : 'RecYds'
}
print(requests.get('https://api.justin-zhai.com/stat', params=payload).text)


payload = {
    'players': 'All'
}
print(requests.get('https://api.justin-zhai.com/stat', params=payload).text)