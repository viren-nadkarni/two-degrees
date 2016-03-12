import csv
import json
from fuzzywuzzy import fuzz


pledges = []

merged_data = []

with open('PledgesPipelineToWeb2.csv', 'rb') as f:
    reader = csv.reader(f)
    for row in reader:
        pledge = {}
        pledge['country'] = row[0]
        pledge['compared_to'] = row[1]
        pledge['target_year'] = row[2]
        if row[3] is None:
            row[3] = 'No pledge'
        pledge['pledge'] = row[3]
        pledges.append(pledge)
    print pledges
    exit

with open('input_data.txt') as f:
    lists = json.load(f)
    for item in lists:
        row = {}
        row['country'] = item[0]
        row['emission'] = item[1]
        row['year'] = item[2]
        flag = False
        for pledge in pledges:

            if fuzz.ratio(row['country'], pledge['country']) > 30:
                row['country'] =pledge['country']
                row['target_year'] = pledge['target_year']
                row['pledge'] = pledge['pledge']
                row['compared_to'] =  pledge['compared_to']
                flag = True
                break
        if flag is False:
            print "no match for %s" %item
            pass
        merged_data.append(row)

#with open('data.json','w') as jsonfile:
#    json.dump(merged_data,jsonfile)


js_data = []
for thing in merged_data:
    jsitem = []
    jsitem.append(str(thing['country']))
    jsitem.append(str(thing['emission']))
    jsitem.append(str(thing['year']))
    jsitem.append(str(thing['pledge']))
    jsitem.append(str(thing['compared_to']))

    js_data.append(jsitem)

with open('js_data','w') as f:
    json.dump(js_data,f)
