#!/usr/bin/env python

import requests
import json
import sqlite3

from flask import *
import flask.ext.cors

from directory import *

app = Flask(__name__)
flask.ext.cors.CORS(app)
app.debug = True

__author__ = 'viren'
__version__ = 'server-0.1'


# parameters ##############################################

rpc_endpoint = 'http://localhost:8545'


# initializers ############################################

conn = sqlite3.connect('server.db')
curs = conn.cursor()

# wrappers ################################################

def get_transaction_count(coinbase):
    data = {"jsonrpc":"2.0",
            "method":"eth_getTransactionCount",
            "params":[coinbase, "latest"],
            "id":1}

    response = json.loads(requests.post(rpc_endpoint, data=json.dumps(data)).text)
    return int(response["result"], 16)


def get_balance(coinbase):
    data = {"jsonrpc":"2.0",
            "method":"eth_getBalance",
            "params":[coinbase, "latest"],
            "id":1}

    response = json.loads(requests.post(rpc_endpoint, data=json.dumps(data)).text)
    return int(response["result"], 16)



# routes ##################################################

@app.route('/')
def apiindex():
    return jsonify(version=__version__)


@app.route('/reset')
def apireset():
    abort(501)


@app.route('/stats')
def stats():
    transactions = 0

    for address in directory.values():
        transactions += get_transaction_count(address)

    return jsonify(transactions=transactions)


@app.route('/stats/<coinbase>')
def statscoinbase(coinbase):
    return jsonify(coinbase=coinbase, 
            balance=get_balance(coinbase), 
            transactions=get_transaction_count(coinbase))


@app.route('/usage/<coinbase>', methods=['GET', 'POST'])
def apirecord(coinbase):
    abort(501)

    if request.method == 'POST':
        # make ethereum transaction
        # record the tx id against coinbase in db
        # because https://github.com/ethereum/go-ethereum/issues/1897
        pass

    elif request.method == 'GET':
        # from db, get all tx for specified coinbase
        # for each tx, get tx value and return
        pass




# serve ###################################################

if __name__ == '__main__':
    try:
        app.run(host='0.0.0.0', port=8080)
    except:
        conn.close()

