#!/usr/bin/env python

import requests
import json
import time
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
master_wallet = '0xf12ade7ad5f18ffcc8b3fc74061a735363d5dbef'


# initializers ############################################

conn = sqlite3.connect('server.db', check_same_thread=False)
curs = conn.cursor()


# wrappers ################################################

def log(message):
    print ' * ' + str(message)


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


def get_block(block_number):
    data = {"jsonrpc":"2.0",
            "method":"eth_getBlockByNumber",
            "params":[block_number, True],
            "id":1}

    response = json.loads(requests.post(rpc_endpoint, data=json.dumps(data)).text)
    result = {"difficulty": int(response["result"]["difficulty"], 16),
            "number": int(response["result"]["number"], 16),
            "size": int(response["result"]["size"], 16),
            "timestamp": int(response["result"]["timestamp"], 16)}
    return result


def send_transaction(tx_from, tx_to, tx_amt):
    data = {"jsonrpc":"2.0",
            "method":"eth_sendTransaction",
            "params":[{"from":tx_from,
                "to":tx_to,
                "value":tx_amt}],"id":1}
    response = json.loads(requests.post(rpc_endpoint, data=json.dumps(data)).text)
    try:
        log(response['error']['message'])
        abort(500)
    except:
        log('tx for {} requested'.format(tx_to))
    return response["result"]


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

    latest_block = get_block("latest")

    return jsonify(totalTransactions=transactions,
            latestBlock=latest_block)


@app.route('/stats/<coinbase>')
def statscoinbase(coinbase):
    return jsonify(coinbase=coinbase,
            balance=get_balance(coinbase),
            transactions=get_transaction_count(coinbase))


@app.route('/usage/<coinbase>', methods=['GET', 'POST'])
def apirecord(coinbase):
    if request.method == 'POST':
        # make ethereum transaction

        request_data = json.loads(request.data)

        tx_to = coinbase
        try:
            tx_from = request_data["from"]
        except:
            tx_from = master_wallet
        tx_amt = request_data["quantity"]
        timestamp = time.strptime(request_data["date"], '%Y-%m-%d')

        tx_id = send_transaction(tx_from, tx_to, tx_amt)

        # record the tx id against coinbase in db
        # because https://github.com/ethereum/go-ethereum/issues/1897

        curs.execute('INSERT INTO tx VALUES("{}", "{}", "{}", "{}")'.format(tx_id, tx_from, tx_to, timestamp))
        conn.commit()
        log('added entry to db: ({}, {}, {}, {})'.format(tx_id, tx_from, tx_to, timestamp))

        return jsonify(receipt=tx_id)

    elif request.method == 'GET':
        # from db, get all tx for specified coinbase
        # for each tx, get tx value and return
        abort(501)
        db_results = curs.execute('SELECT * FROM tx WHERE tx_from="{}"'.format(coinbase))
        print db_results


# serve ###################################################

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)

