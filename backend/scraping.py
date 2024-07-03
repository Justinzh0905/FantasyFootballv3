import pandas as pd
import datetime
import os 
import json
import re
from bs4 import BeautifulSoup as bs
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

currentTime = datetime.datetime.now()
year = currentTime.year

stats = []


#remove data and rescrape if it is more than three days old 
for file in ['stats.csv', 'FPRankings.csv']:
    mtime = datetime.datetime.fromtimestamp(os.path.getmtime(file))

    if (currentTime - mtime).days > 3:
        os.remove(file)

#scrape past fantasy data 
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



#scrape current ADP trends from ESPN
if not os.path.isfile('espnADP.csv'):
    browser = webdriver.Chrome()
    browser.get('https://fantasy.espn.com/football/livedraftresults')

    for i in range(8):
        time.sleep(5)
        try:
            element = WebDriverWait(browser, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, 'Table'))
            )

        except TimeoutError:
            pass


        soup = bs(browser.page_source)

        s = str(soup.find('table'))

        with open('espnADP.txt', 'a') as f:
            f.write(s)

        browser.find_element(By.XPATH , "/html/body/div[1]/div[1]/div/div/div[5]/div[2]/div[2]/div/div/div/div[3]/nav/button[2]").click()

    with open('espnADP.txt', 'r') as file:
        data = file.read()

    lst = pd.read_html(data, flavor='bs4')
    df = pd.concat(lst)
    df.columns = df.columns.droplevel()

    def find_team(string):
        postfix = string[-3:]
        index = next(pos for pos,char in enumerate(postfix) if char.isupper())
        return postfix[index:]

    columns = list(df.columns)
    columns[-2] = 'DELETE'
    df.columns = columns
    df['POS'] = df['Player'].map(lambda name: name[-2:])
    df['Player'] = df['Player'].map(lambda name: name[:-2].replace('Q',''))
    df['TM'] = df['Player'].map(lambda x: find_team(x).upper())
    df['Player'] = df['Player'].map(lambda x: x.replace(find_team(x),''))
    df.drop(['AVG SALARY', 'DELETE'],axis=1, inplace=True)

    cols = list(df.columns) 
    cols.remove('Player')
    cols.insert(0, 'Player')
    df = df.reindex(columns=cols)

    df.set_index('Player',inplace=True)

    df.to_csv('espnADP.csv')
    os.remove('espnADP.txt')


#scrape expert rankings from FantasyPros
if not os.path.isfile('FPRankings.csv'):
    browser = webdriver.Chrome()
    browser.get('https://www.fantasypros.com/nfl/rankings/ppr-cheatsheets.php')


    try:
        element = WebDriverWait(browser, 10).until(
            EC.presence_of_element_located((By.ID, 'ranking-table'))
        )

    except TimeoutError:
        pass


    soup = bs(browser.page_source)

    data = str(soup.find('table'))

    df = pd.read_html(data, flavor='bs4')[0]

    def find_team(string):
        reg = r'(\(\w*\))'
        return re.findall(reg, string)[0]
    
    df.drop(['WSID', 'SOS SEASON', 'ECR VS. ADP'], axis=1, inplace=True)

    df = df[df['RK'].str.contains('^\d')]
    df.rename(columns={'Player Name': 'Player'}, inplace=True)
    df['TM'] = df['Player'].map(lambda x: find_team(x).strip('()'))
    df['Player'] = df['Player'].map(lambda x: x.replace(find_team(x), '').strip())
    df['Pos Rank'] = df['POS'].map(lambda x: x[len(x.rstrip('0123456789')):])
    df['POS'] = df['POS'].map(lambda x: x.rstrip('0123456789'))
    df.set_index('Player',inplace=True)

    df.to_csv('FPRankings.csv')