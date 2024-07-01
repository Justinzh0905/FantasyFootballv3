import pandas as pd
import datetime
import os 
import json

year = datetime.datetime.now().year

stats = []

if not os.path.isfile('stats.csv'):
    for i in range(year-5, year):
        url = f'https://www.pro-football-reference.com/years/{i}/fantasy.htm'
        df = pd.read_html(url)[0]

        df.columns = df.columns.get_level_values(-1)
        df.replace('(\+)|(\*)', '', regex=True,inplace=True)


        df.drop(['OvRank', '2PM', '2PP', 'DKPt', 'FantPt', 'FDPt'], axis=1, inplace= True)

        df = df[df['Player'] != 'Player']

        df.fillna(0, inplace=True)
        
        columns = list(df.columns)

        #fix duplicate names
        columns[columns.index('Att')] = 'PassAtt'
        columns[columns.index('Att')] = 'RushAtt'
        columns[columns.index('Yds')] = 'PassYds'
        columns[columns.index('Yds')] = 'RushYds'
        columns[columns.index('Yds')] = 'RecYds'
        columns[columns.index('TD')] = 'PassTD'
        columns[columns.index('TD')] = 'RushTD'
        columns[columns.index('TD')] = 'RecTD'

        df.columns = columns 

        df['Year'] = i
        stats.append(df)

    df = pd.concat(stats, ignore_index=True)

    df.set_index(['Player', 'Year'], inplace=True)
    #df.sort_index(level=0, inplace=True)

    #df.to_csv('stats.csv', quoting=csv.QUOTE_NONNUMERIC, quotechar='')
    df.to_csv('stats.csv')


# prototype for accessing player stats locally, not used 
def player_data(players, stat):
    if not type(players) is list:
        players = [players]
    df = pd.read_csv('stats.csv', index_col=['Player', 'Year'])

    res = {}
    for player in players:
        player_stat = df.loc[player, stat].to_dict()

        #fill in blank years with N/A
        for i in range(year-5, year):
            if i not in player_stat.keys():
                player_stat[i] = 'N/A'
        
        #sort stats by year
        sorted_stat = {i: player_stat[i] for i in sorted(list(player_stat.keys()))}

        res[player] = sorted_stat


    
    return json.dumps(res)
