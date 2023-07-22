# MSDT_BlockchainPersonalCoin
## Coin backend
#### 1. Setup
- Go to back-end root directory:
  ```
  cd coin_backend
  ```
- Install dependencies using npm or yarn package manager:
  ```
  npm i
  ```
  or
  ```
  yarn
  ```
- Configure environment variables (view [.env.template](https://github.com/anhle199/MSDT_BlockchainPersonalCoin/blob/master/coin_backend/.env.template) for more detail):
  - Create `.env` file at the same level with `.env.template`
  - Declare the following variable to `.env` file:
    ```
    REST_PORT=3000
    SOCKET_PORT=6000
    
    # path to private file
    # default: private is store at the `data` directory
    PRIVATE_KEY_PATH=
    ```
#### 2. Start application
- Using the following command:
  ```
  npm run start
  ```
  or
  ```
  yarn start
  ```
- App is running on two ports:
  - REST API: `REST_PORT`
  - WebSocket: `SOCKET_PORT`
  

## Wallet UI
#### 1. Setup
- Go to front-end root directory:
  ```
  cd wallet_ui
  ```
- Install dependencies using npm or yarn package manager:
  ```
  npm i
  ```
  or
  ```
  yarn
  ```
- Configure environment variables (view [.env.template](https://github.com/anhle199/MSDT_BlockchainPersonalCoin/blob/master/wallet_ui/.env.template) for more detail):
  - Create `.env` file at the same level with `.env.template`
  - Declare the following variable to `.env` file:
    ```
    REACT_APP_WEBSITE_NAME=React App
  
    # one of blockchain nodes (rest api)
    REACT_APP_API_URL=
    ```
#### 2. Start application
- Using the following command:
  - Runs on default port: 3000
    ```
    npm start
    ```
    or
    ```
    yarn start
    ```
  - Run with specific port, use [set environment variable on command line](https://stackoverflow.com/a/41770848) syntax (below syntax is compatible with MacOS):
    ```
    PORT=3002 npm start
    ```
    or
    ```
    PORT=3002 yarn start
    ```
- App is running on `http://localhost:{$PORT}`, you can view it in the browser.

## Runs app using Docker (comming soon)

## Video Demo
- [[CSC13115 - 19KTPM] - Blockchain | Personal Coin Demo](https://youtu.be/Pu3wGHDC4Dc)

## References
- [Naivecoin: a tutorial for building a cryptocurrency](https://lhartikk.github.io/)
- [MyEtherWallet](https://www.myetherwallet.com/)
- [Ethereum](https://etherscan.io/)
