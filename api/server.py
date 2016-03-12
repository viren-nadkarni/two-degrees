#!flask/bin/python
from flask import Flask, jsonify
import json
from flask.ext.cors import CORS


app = Flask(__name__)
CORS(app)


userdata = []

with open('data.json') as f:
    userdata = json.load(f)


@app.route('/users', methods=['GET'])
def get_users():
    return jsonify({'users': userdata})

@app.route('/users/<userid>', methods=['GET'])
def get_userid(userid):
    for user in userdata:
        if userid ==  user['id']:
            return jsonify(user)

@app.route('/users/<userid>/transactions/energy/<year>', methods=['GET'])
def get_yearly(userid,year):
    for user in userdata:
        if userid ==  user['id']:
            months = []
            for months_detail in user['transactions']['energy']:
                if months_detail['year']== year:
                    months.append(months_detail)

            return jsonify(months)


@app.route('/users/<userid>/transactions', methods=['GET'])
def get_transactions(userid):
    for user in userdata:
        if userid ==  user['id']:
            return jsonify({'transactions':user['transactions']['energy']})




if __name__ == '__main__':
    app.run(debug=True,port=80,host='0.0.0.0')

