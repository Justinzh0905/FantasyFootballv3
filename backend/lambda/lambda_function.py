import boto3
from boto3.dynamodb.conditions import Key,Attr
from dynamodb_json import json_util as db_json
import json

client = boto3.client('dynamodb')
dynamodb = boto3.resource('dynamodb')



def lambda_handler(event, context):
    print(event)
    body = {}
    statusCode = 200
    try:
        if event['routeKey'] == "GET /stat":
            table = dynamodb.Table('Player-Stats')
            players = event['queryStringParameters']['players'].split(',')
            
            #return all player names 
            if players[0] == "All":
                response = table.scan(
                    ProjectionExpression="Player"
                )
                names = db_json.loads(response["Items"])
                names = [row['Player'] for row in names]
                body['Players'] = sorted(list(set(names)))
                
            else:
                for player in players:
                    response =  table.query(
                        KeyConditionExpression=Key('Player').eq(player),
                        ProjectionExpression=f"#y, {event['queryStringParameters']['stat']}",
                        ExpressionAttributeNames = {'#y': 'Year'}
                    )

                    stats = db_json.loads(response["Items"])
                    stats = {row['Year']: row[event['queryStringParameters']['stat']] for row in stats}
                    body[player] = stats
        elif event['routeKey'] == "GET /ranking":
            table = dynamodb.Table('Player-Rankings')
            response = table.scan()
            body['Rankings'] = db_json.loads(response['Items'])

        elif event['routeKey'] == "GET /adp":
            table = dynamodb.Table('Player-ADP')
            response = table.scan()
            body['adp'] = db_json.loads(response['Items'])
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
