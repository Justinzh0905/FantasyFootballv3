import requests


payload = {
    'players': ['Stefon Diggs', 'Tyreek Hill', 'CeeDee Lamb'],
    'stat' : 'RecYds'
}
print(requests.get('https://football.justin-zhai.com/stat', params=payload).text)