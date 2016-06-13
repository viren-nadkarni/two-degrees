API documentation
=================

`GET /stats` Ethereum network statistics
----------------------------------------

Request
curl localhost:8080/stats

Response
{
  "latestBlock": {
    "difficulty": 346253,
    "number": 2191,
    "size": 537,
    "timestamp": 1456737490
  },
  "totalTransactions": 13
}


`GET /stats/<coinbase>` Statistics for a coinbase
-------------------------------------------------

Request
curl localhost:8080/stats/0xf70f85cbeff885d498d0fc2ac92eb78fd05874e2

Response
{
  "totalUsage": 74.9,
  "carboncoinBalance": 520,
  "coinbase": "0xf70f85cbeff885d498d0fc2ac92eb78fd05874e2",
  "transactions": 7
}


`GET /usage/<coinbase>` Fetch usage for a coinbase
--------------------------------------------------

Request
curl localhost:8080/usage/0xf70f85cbeff885d498d0fc2ac92eb78fd05874e2

Response
{
  "coinbase": "0xf12ade7ad5f18ffcc8b3fc74061a735363d5dbef",
  "usage": [
    {
      "date": "2015-01-01",
      "value": 2.5
    },
    {
      "date": "2015-02-01",
      "value": 5
    }
  ]
}


`POST /usage/<coinbase>` Record usage for a coinbase
----------------------------------------------------

Request
curl localhost:8080/usage/0xf70f85cbeff885d498d0fc2ac92eb78fd05874e2 \
-H 'content-type:application/json' \
-X POST -d '
{
    "quantity": 1,
    "date": "2015-1-1"
}'

Response
{
  "receipt": "0xdeaf4feb71b763d25b837b3abc6a581640600651e579213a73f0de7e425b3da5"
}


`GET /goal/<coinbase>` Get the current goal for a coinbase
----------------------------------------------------------

Request
curl localhost:8080/goal/0xf70f85cbeff885d498d0fc2ac92eb78fd05874e2

Response
{
    "targetUsage": 125.5,
    "targetDate": "2015-1-1",
    "contractAddress": "0xdaa24d02bad7e9d6a80106db164bad9399a0423e"
}

`POST /goal/<coinbase>` Set a goal for a coinbase
----------------------------------------------------

Request
curl localhost:8080/goal/0xf70f85cbeff885d498d0fc2ac92eb78fd05874e2 \
-H 'content-type:application/json' \
-X POST -d '
{
    "targetUsage": 125.5,
    "targetDate": "2015-1-1"
}'

Response
{
  "contractAddress": "0xdaa24d02bad7e9d6a80106db164bad9399a0423e"
}

`POST /transfer` Transfer greencoins to a wallet
----------------------------------------------------

Request
```
curl localhost:8080/transfer \
-H 'content-type:application/json' \
-X POST -d '
{
    "sender": "0xf12ade7ad5f18ffcc8b3fc74061a735363d5dbef",
    "recipient": "0xf70f85cbeff885d498d0fc2ac92eb78fd05874e2",
    "amount": 42
}'
```
Response
```
{
  "transaction": "0xdaa24d02bad7e9d6a80106db164bad9399a0423e"
}
```
