## Problem

Exchanges interact with the Ethereum chain constantly throughout the day to carry out various operations such as withdraws, dApp interactions, etc. The cost of one interaction or transaction (transaction fees) in the Ethereum network is calculated as: Gas used by the transaction \* Gas price . While doing these interactions on the chain, it is crucial to ensure that we utilize the chain in an efficient and costeffective manner to reduce our operational costs.

## Solution

Utilize publicly available gas price data-feeds such as EthGasStation to get valuable insights on reducing the costs of running operations.

## Description

Ethereum Gas Price Tracker
Inserting gas price data to databse from the ETH Gas Station every 3 seconds.
Support 2 endpoint

1. /gas

- Returns the current gas prices at different tiers (fast, average, low) at the current block number
- Valid Results
  - In case of error :
    {
    error: 'true',
    timestamp: <Date>,
    statusCode: <StatusCode>,
    statusMessage: <Message regarding statuscode>,
    message: <Message regarding error>,
    path: <request.url>
    }
  - In case of successful result
    {
    error : 'false',
    message : {
    fast : <fast>,
    average : <average>,
    low : <low>,
    blockNum : <blockNum>
    }
    }

2. /average&fromTime=<UNIXTIMESTAMP>&toTime=<UNIXTIMESTAMP>

- Returns the average gas price between a specified time interval
- Valid Results
  - In case of error :
    {
    error: 'true',
    timestamp: <Date>,
    statusCode: <StatusCode>,
    statusMessage: <Message regarding statuscode>,
    message: <Message regarding error>,
    path: <request.url>
    }
  - In case of successful result
    {
    error : 'false',
    message : {
    averageFast : <averageFast>,
    average : <average>,
    averageLow : <averageLow>,
    fromTime : <UNIXTIMESTAMP>,
    toTime : <UNIXTIMESTAMP>
    }
    }

## ENV FILE

```bash
PORT = <YOUR_SERVER_PORT>
MYSQL_HOST = db
MYSQL_ROOT_PASSWORD = <YOUR_PASSWORD>
MYSQL_PASSWORD = <YOUR_PASSWORD>
MYSQL_USER = root
MYSQL_DATABASE = ETHGasPrice
MYSQL_PORT = 3306
API_KEY = <YOUR_API_KEY>
NODE_ENV = production
```

## START

1. Setting up .env file
2. Run docker compose

```bash
$ docker-compose up -d prod db
```

## START AS DEVELOPMENT MODE

1. Setting up NODE_ENV to development on .env file
2. Run docker compose

```bash
$ docker-compose up -d main db
```

## DATABASE

```bash
id        INT(11) PRIMAY_KEY AUTO_INCREMENT
fast      DECIMAL(10,2)
average   DECIMAL(10,2)
low       DECIMAL(10,2)
blockNum  INT(11)
createAt  DATE
```

## ETH GAS STATION

Well documented, simple and easy to use.

## Why Rest?

Users do not send anything to server. They are just getting data about gas price. Thus, the connection between user and the server do not have to be stateful. As a result, Rest is more efficient than WebSocket.
