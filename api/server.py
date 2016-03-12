#!flask/bin/python
from flask import Flask, jsonify
import json
from flask.ext.cors import CORS
from pymongo import MongoClient
from bson import json_util
import operator


app = Flask(__name__)
CORS(app)


# userdata = []
#
# with open('data.json') as f:
#     userdata = json.load(f)


client = MongoClient('mongodb://miner:Aq1sw2de@ds011429.mlab.com:11429/twodegree')
db = client.twodegree
collection = db.users


@app.route('/users/', methods=['GET'])
def get_users():
    # return jsonify({'users': userdata})
    users = collection.find()
    return json_util.dumps(users, sort_keys=True, indent=4, default=json_util.default)

@app.route('/users/<userid>', methods=['GET'])
def get_userid(userid):
    user=collection.find({'id': userid})
    return json_util.dumps(user, sort_keys=True, indent=4, default=json_util.default)

@app.route('/users/<userid>/<year>/', methods=['GET'])
def get_year(userid,year):
    user=collection.find_one({'id': userid})
    months = []
    for item in user['transactions']['energy']:
        if (int(item['year']) == int(year)):
            months.append(item)
    return json.dumps(months)

@app.route('/users/<userid>/<year>/<month>', methods=['GET'])
def get_month(userid,year,month):
    user=collection.find_one({'id': userid})
    for item in user['transactions']['energy']:
        if (int(item['year']) == int(year) and int(item['month']) == int(month)):
            return json.dumps(item)
    return {}

@app.route('/topscore', methods=['GET'])
def topscore():
    users=collection.find()
    arr = []
    for item in users:
        usr = {}
        usr['state'] = item['state']
        sum_of_cc=0
        for month in item['transactions']['energy']:
            sum_of_cc += month['earned_coins']

        usr['balance'] = round(sum_of_cc,2)
        usr['wallet_id'] = item['id']
        usr['name'] = item['name']
        print usr['wallet_id']
        arr.append(usr)

    coll=db.dk
    dk = coll.find_one()
    usr={}
    usr['state'] = dk['state']
    sum_of_cc=0
    for month in dk['transactions']['energy']:
        sum_of_cc += month['earned_coins']
    print sum_of_cc
    usr['balance'] = sum_of_cc
    usr['wallet_id'] = dk['id']
    usr['name'] = dk['name']

    arr.append(usr)
    arr.sort(key=operator.itemgetter('balance'),reverse=True)
    return json.dumps(arr)



# app endpoints

@app.route('/app/users/<userid>', methods=['GET'])
def app_get_userid(userid):
    coll=db.dk
    user=coll.find({'id': userid})
    return json_util.dumps(user, sort_keys=True, indent=4, default=json_util.default)

@app.route('/app/users/<userid>/<year>/<month>', methods=['GET'])
def app_get_month(userid,year,month):
    coll=db.dk
    user=coll.find_one({'id': userid})
    for item in user['transactions']['energy']:
        if (int(item['year']) == int(year) and int(item['month']) == int(month)):
            return json.dumps(item)
    return {}



@app.route('/app/users/<userid>/<year>/', methods=['GET'])
def app_get_year(userid,year):
    coll=db.dk
    user=coll.find_one({'id': userid})
    months = []
    for item in user['transactions']['energy']:
        if (int(item['year']) == int(year)):
            months.append(item)
    return json.dumps(months)



@app.route('/app/users/<userid>/<year>/<month>/<day>', methods=['GET'])
def app_get_day(userid,year,month,day):
    coll=db.dk
    user=coll.find_one({'id': userid})
    for item in user['transactions']['energy']:
        if (int(item['year']) == int(year) and int(item['month']) == int(month)):
            return json.dumps(item['daily_values'][int(day)-1])
    return {}




if __name__ == '__main__':
    app.run(debug=True,port=80,host='0.0.0.0')
