#!/bin/bash
geth --networkid="314159" --genesis ~/genesis.json --datadir="~/eth" --rpc console 2>> ~/eth/eth.log
