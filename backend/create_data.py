import os 

file_list = []
output = []
with open('vbd.csv') as file:
    lines = file.readlines()
    
    for line in lines[1:]:
        output.append('createData(' + line[:-1] + '),\n')

with open('vbd.txt', 'w') as file:
    for line in output:
        file.write(line)
