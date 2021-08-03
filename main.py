import csv
import json

# Final dictionary that holds all the players
playerDict = {}

# Opens csv file and reads in the data line by line
with open('players.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    next(csv_file)
    team = ''

    # Gets player info
    for row in csv_reader:
        if row[0] != '':
            team = row[0]
        else:
            name = row[1]
            number = row[2]
            dynasty = row[3]
            dynastyPPR = row[4]
            seasonal = row[5]
            seasonalPPR = row[6]

            # Create the key in the format 'matthewstaffordLAR9'
            key = name.replace(" ", "").lower() + team + number

            # Create the data object and add to playerDict
            obj = {
                'name': name,
                'team': team,
                'number': number,
                'dynasty': dynasty,
                'dynastyPPR': dynastyPPR,
                'seasonal': seasonal,
                'seasonalPPR': seasonalPPR
            }

            playerDict[key] = obj

# Write the data to a text file
f = open("playerDict.txt", "w")
f.write(json.dumps(playerDict, indent=4))
f.close()