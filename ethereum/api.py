#!/usr/bin/env python

import requests
import pickle
import json
import time
import datetime
import sqlite3
import ethjsonrpc

from flask import *
import flask.ext.cors

from directory import *
import lib

app = Flask(__name__)
flask.ext.cors.CORS(app)
cors = flask.ext.cors.CORS(app, resources={r"/*": {"origins": "*"}})

app.debug = True

__author__ = 'viren'
__version__ = 'server-0.1'

# parameters ##############################################

rpc_endpoint = 'http://localhost:8545'
master_wallet = directory['td1']
contract_bytecode = None
contract_address = None
goals = None
ledger = None

# initializers ############################################

conn = sqlite3.connect('server.db', check_same_thread=False)
curs = conn.cursor()

eth = ethjsonrpc.EthJsonRpc('127.0.0.1', 8545)

# helpers #################################################

def log(message):
    print ' * ' + str(message)

def get_transaction_count(coinbase):
    data = {"jsonrpc":"2.0",
            "method":"eth_getTransactionCount",
            "params":[coinbase, "latest"],
            "id":1}

    response = json.loads(requests.post(rpc_endpoint, data=json.dumps(data)).text)
    return int(response["result"], 16)

def get_usage_by_transaction_hash(tx_hash):
    data = {"jsonrpc":"2.0",
            "method":"eth_getTransactionByHash",
            "params":[tx_hash],
            "id":1}
    response = json.loads(requests.post(rpc_endpoint, data=json.dumps(data)).text)
    return (1.0*int(response["result"]["value"], 16))/(10**9)

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

def compile_solidity(source):
    data = {"jsonrpc":"2.0",
            "method":"eth_compileSolidity",
            "params":[source],"id":1}

    response = json.loads(requests.post(rpc_endpoint, data=json.dumps(data)).text)

    log("Bytecode compiled")
    return response['result']

def create_contract(bytecode, coinbase):
    data = {"jsonrpc":"2.0",
            "method":"eth_sendTransaction",
            "params":[{
                "from": coinbase,
                "data": bytecode['Carboncoin']['code']
            }],
            "id":1}
    response = json.loads(requests.post(rpc_endpoint, data=json.dumps(data)).text)
    try:
        response["result"]
    except:
        log(response['error']['message'])
        abort(500)
    log("Contract initiated")

    data2 = {"jsonrpc":"2.0",
            "method":"eth_getTransactionReceipt",
            "params":[
                response['result']
            ],"id":1}

    # wait while the contract is being mined
    while True:
        response2 = json.loads(requests.post(rpc_endpoint, data=json.dumps(data2)).text)
        if response2['result'] != None:
            break
        time.sleep(1)
    log("Contract mined")

    return response2['result']['contractAddress']

def init_contract():
    global contract_bytecode
    global contract_address

    # set the goal (create the contract)
    contract_source = ''.join( [ line.strip() for line in open('../ethereum/contract.sol', 'r').readlines()] )

    # compile contract bytecode
    contract_bytecode = compile_solidity(contract_source)

    # initiate contract
    contract_address = create_contract(contract_bytecode, master_wallet)

# delete `pickle.store` when fresh blockchain is deployed
try:
    contract_bytecode, contract_address = pickle.load(open('pickle.store', 'r'))
except:
    init_contract()
    pickle.dump((contract_bytecode, contract_address), open('pickle.store', 'w'))

# temporary: serialize goals
try:
    goals = pickle.load(open('goals.store', 'r'))
except:
    goals = dict()
    pickle.dump(goals, open('goals.store', 'w'))

# temporary: serialize greencoin ledger
try:
    ledger = pickle.load(open('ledger.store', 'r'))
except:
    ledger = dict()
    for wallet in directory.keys():
        ledger[wallet] = 0
    pickle.dump(ledger, open('ledger.store', 'w'))

# routes ##################################################

@app.route('/')
def apiindex():
    return jsonify(version=__version__)

@app.route('/reset')
def apireset():
    # recreate the contract?
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
# debug
#    return jsonify(coinbase=coinbase,
#            carboncoinBalance=1234,
#            lifetimeUsage=(1.0*get_balance(coinbase))/10**9,
#            transactions=get_transaction_count(coinbase))
# debug

    try:
        carboncoin_balance = eth.call(contract_address, 'balance(address)', [coinbase], ['uint64'])[0]
    except:
        carboncoin_balance = 0

    return jsonify(coinbase=coinbase,
            carboncoinBalance=carboncoin_balance,
            lifetimeUsage=(1.0*get_balance(coinbase))/10**9,
            transactions=get_transaction_count(coinbase))

@app.route('/usage/<coinbase>', methods=['GET', 'POST'])
def apirecord(coinbase):
    if request.method == 'POST':
        # make ethereum transaction
        request_data = json.loads(request.data)

        # transfer etherse
        tx_to = coinbase
        try:
            tx_from = request_data["from"]
        except:
            tx_from = master_wallet
        tx_amt = request_data["quantity"] * 10**9
        timestamp = datetime.datetime.strptime(request_data["date"], '%Y-%m-%d')

        tx_id = send_transaction(tx_from, tx_to, tx_amt)

        # increment contract cumulative usage
        #eth.call(contract_address, 'recordUsage(address, uint)', [coinbase, tx_amt], [])

        # record the tx id against coinbase in db
        # because https://github.com/ethereum/go-ethereum/issues/1897

        curs.execute('INSERT INTO tx VALUES(?, ?, ?, ?)', (tx_id, tx_from, tx_to, timestamp))
        conn.commit()
        log('added entry to db: ({}, {}, {}, {})'.format(tx_id, tx_from, tx_to, timestamp))

        return jsonify(receipt=tx_id)

    elif request.method == 'GET':
        # from db, get all tx for specified coinbase
        # for each tx, get tx value and return
        db_results = curs.execute('SELECT * FROM tx WHERE tx_to="{}"'.format(coinbase))
        usage_list = []

        for r in db_results:
            try:
                usage_list.append({"date": r[3][:10],
                    "value": get_usage_by_transaction_hash(r[0])})
            except:
                pass

        return jsonify(coinbase=coinbase,
                usage=usage_list)

@app.route('/goal/<coinbase>', methods=['GET', 'POST'])
def apigoal(coinbase):
    if request.method == 'POST':
        request_data = json.loads(request.data)

        target_usage = int(request_data['targetUsage'])
        timestamp = int(time.mktime(datetime.datetime.strptime(request_data['targetDate'], '%Y-%m-%d').timetuple()))

        eth.call_with_transaction(eth.eth_coinbase(),
                contract_address,
                'setGoal(address,uint64,uint64)',
                [coinbase, target_usage, timestamp])
        log('contract updated')
        goals[coinbase] = ':'.join([coinbase, str(target_usage), str(timestamp)])
        pickle.dump(goals, open('goals.store', 'w'))

        return jsonify(status='success')

    elif request.method == 'GET':
        try:
            goal_usage = eth.call(contract_address, 'getGoal(address)', [coinbase], ['uint64'])
        except:
            print goals[coinbase].split(':')
            goal_usage = goals[coinbase].split(':')[1] if coinbase in goals.keys() else 0

        return jsonify(goalUsage=goal_usage)

@app.route('/goal/check/<coinbase>')
def apigoalcheck(coinbase):
    # check if goal has been met
    # if yes, distribute reward
    # disabled temporarily
    abort(501)
    try:
        eth.call_with_transaction(eth.eth_coinbase(),
            contract_address,
            'checkGoal(address,uint64)',
            [coinbase, int(time.time())])
    except:
        pass
    finally:
        ledger[coinbase] += 10

@app.route('/transfer')
def transfer():
    # transfer greencoins to a specified wallet
    if request.method == 'POST':
        pass

@app.route('/logs/transactions')
def gettx():
    return jsonify(transactions=lib.get_all_blocks_txns())

@app.route('/logs/transactions/<coinbase>')
def getwallettx(coinbase):
    return jsonify(transactions=lib.get_all_blocks_txns(coinbase))

@app.route('/contract')
def contractapi():
    return jsonify(contractAddress=contract_address,
            contractBytecode=contract_bytecode)

# serve ###################################################

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)

