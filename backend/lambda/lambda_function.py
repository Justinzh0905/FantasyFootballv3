import boto3
from boto3.dynamodb.conditions import Key,Attr
from dynamodb_json import json_util as db_json
import json

client = boto3.client('dynamodb')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Player-Stats')

def getstats(players, stat):
    if not type(players) is list:
        players = [players]

    stats = {}
    for player in players:
        response = db_json.loads(table.query(
            KeyConditionExpression=Key('Player').eq(player),
            ProjectionExpression=f'#y, {stat}',
            ExpressionAttributeNames = {'#y': 'Year'}
        ))

        stats[player] = response['Items']

    return json.dumps(stats)

def lambda_handler(event, context):
    print('start')
    print(event)
    body = {}
    statusCode = 200

    try:
        if event['routeKey'] == "GET /stat":

            print('query string: ' + event['queryStringParameters']['players'])
            for player in event['queryStringParameters']['players'].split(','):
                response =  table.query(
                    KeyConditionExpression=Key('Player').eq(player),
                    ProjectionExpression=f'#y, {event['queryStringParameters']['stat']}',
                    ExpressionAttributeNames = {'#y': 'Year'}
                )

                print(response)
                body[player] = db_json.loads(response["Items"])
    except KeyError:
        statusCode = 400
        body = 'Unsupported route: ' + event['routeKey']
    body = json.dumps(body)
    res = {
        "statusCode": statusCode,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": body
    }
    return res
