'''
Created on Mar 12, 2016

@author: manish_kelkar
'''
import httplib
import json
import datetime

all_txns=[]
'''
Call get_all_blocks_txns to get all transactions
Input to_address to filter based on ID
'''
def get_all_blocks_txns(to_address=None):
    last_block_id=get_latest_block()
    last_block_id=str(last_block_id['result']['number'])
    #print "last block %s" % last_block_id
    #block_number=1
    start=int(last_block_id,0) - 100
    if start < 0:
        start=1
    block_number=start
    for block_number in range(start,int(last_block_id,0)+1):
        get_all_tx(block_number,to_address)
    all_txns.reverse()
    return all_txns

def get_all_tx(block_id,to_address=None):
    block=get_blk(block_id)
    #print block
    txns=block['result']['transactions']
    timestamp=block['result']['timestamp']
    for txn in txns:
        #txn['timestamp']='%s' % int(str(timestamp),0)
        ts=(datetime.datetime.fromtimestamp(int(str(timestamp),0)).strftime('%d-%m-%Y %H:%M:%S'))
        txn['timestamp']='%s' % ts
        txn['value']=1.0*int(txn['value'], 16)/10**9
        if to_address!=None:
            #print str(txn['to'])
            #print str(to_address)
            if str(txn['to']) == str(to_address):
                #print "Pi found"
                all_txns.append(txn)

        else:
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
    #last_block_id=get_call("/stats",8080)
    #print last_block_id
    #data = '{"jsonrpc":"2.0","method":"eth_getTransactionCount","params":["latest", "latest"],"id":1}'
    data = '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["latest", true],"id":1}'
    last_block_id=post_call("/",data)
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

#print get_all_blocks_txns()
#print get_all_blocks_txns('0x6015fb43e26226d80edc1c209ccd99ce2493497b')


