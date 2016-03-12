'''
Created on Mar 12, 2016

@author: manish_kelkar
'''
import httplib
import json


all_txns=[]
'''
Call get_all_blocks_txns to get all trasactions
'''
def get_all_blocks_txns():
    last_block_id=get_latest_block()
    last_block_id=last_block_id['latestBlock']['number']
    #print "last block %s" % last_block_id
    block_number=1
    for block_number in range(1,int(last_block_id+1)):
        get_all_tx(block_number)
    return all_txns

def get_all_tx(block_id):
    block=get_blk(block_id)
    #print block
    txns=block['result']['transactions']
    for txn in txns:
        all_txns.append(txn)
    return all_txns


#eth_getBlockByNumber
def get_blk(blk_num):
    hex_blk_num=hex(blk_num)
    #print "Querying block number %s " % hex_blk_num
    data='{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["%s", true],"id":1}' % hex_blk_num
    #print data
    block_details=post_call("/",data)
    #print block_details
    return block_details

#eth_blockNumber
def get_latest_block():
    last_block_id=get_call("/stats",8080)
    #print last_block_id
    return last_block_id

def get_call(url,port=8545):
    #curl -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":83}'
    connection=httplib.HTTPConnection("localhost",port)
    connection.request("GET", url)
    response = (connection.getresponse()).read()
    connection.close()
    response=json.loads(response)
    #print response
    return response

def post_call(url,data):
    connection=httplib.HTTPConnection("localhost",8545)
    #url = "/v3/users"
    #data='{"user":{"name": "%s","password": "%s","enabled": true,"email": "%s","default_project_id": "%s"}}' % (name,password,email,projectid)
    connection.request("POST", url,data)
    #connection.send(data)
    response = (connection.getresponse()).read()
    connection.close()
    response=json.loads(response)
    return response
