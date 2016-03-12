#!/usr/bin/env python
import requests
import json
from flask import *
from flask.ext.cors import CORS

from directory import *

app = Flask(__name__)
CORS(app)
app.debug = True

__author__ = 'viren'
__version__ = '0.1'


# parameters ##############################################

rpc_endpoint = 'http://localhost:8545'


# routes ##################################################

@app.route('/')
def apiindex():
    return jsonify(version=__version__)

@app.route('/stats/transactions')
def statstransactions():
    transactions = 0

    for address in directory.values():
        data = { "jsonrpc": "2.0",
                "method": "eth_getTransactionCount",
                "params": [address, "latest"],
                "id": 1}

        response = requests.post(rpc_endpoint, data=json.dumps(data))
        print response.text
        transactions += int(json.loads(response.text)["result"], 16)

    return jsonify({"transactions": transactions})


# serve ###################################################

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
