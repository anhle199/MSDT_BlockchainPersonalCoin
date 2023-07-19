import dotenv from 'dotenv'
import { Application } from './application'
import { getEnv } from './common'
import {
  BlockController,
  P2PController,
  SocketController,
  TransactionController,
  WalletController,
} from './controllers'

dotenv.config()

const restPort = getEnv('REST_PORT', { castToType: 'number', throwErrorIfNotExists: false, defaultValue: 3000 })
const socketPort = getEnv('SOCKET_PORT', { castToType: 'number', throwErrorIfNotExists: false, defaultValue: 6000 })

const app = new Application({
  rest: {
    port: restPort,
    controllers: [new BlockController(), new P2PController(), new TransactionController(), new WalletController()],
  },
  socket: {
    port: socketPort,
    controllers: [new SocketController()],
  },
})
app.setup()
app.start()
