import boto3
from boto3.dynamodb.conditions import Key,Attr
from dynamodb_json import json_util as db_json
import json

client = boto3.client('dynamodb')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Player-ADP')
response = table.scan()
print('scanned--- /n', response['Items'])