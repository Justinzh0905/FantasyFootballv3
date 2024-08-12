import os 

file_list = ['VBD', 'Age']


for file in file_list:
    output = []
    with open(file + '.csv') as f:
        lines = f.readlines()
        
        for line in lines[1:]:
            output.append('create' + file + 'Data(' + line[:-1] + '),\n')

    with open(file + '.txt', 'w') as f:
        for line in output:
            f.write(line)
