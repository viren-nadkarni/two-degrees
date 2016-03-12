import pymongo
from pymongo import MongoClient
import json

client = MongoClient('mongodb://miner:Aq1sw2de@ds011429.mlab.com:11429/twodegree')
db = client.twodegree
collection = db.users

with open('data.json') as f:
    data=json.load(f)

for item in data:
    print collection.insert_one(item).inserted_id
