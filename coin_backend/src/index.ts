import dotenv from 'dotenv'
import { Application } from './application'
import { getEnv } from './common'
import { BlockController } from './controllers'

dotenv.config()

const restPort = getEnv('REST_PORT', { castToType: 'number', throwErrorIfNotExists: false, defaultValue: 3000 })
const socketPort = getEnv('SOCKET_PORT', { castToType: 'number', throwErrorIfNotExists: false, defaultValue: 6000 })

const app = new Application({
  rest: {
    port: restPort,
    controllers: [new BlockController()],
  },
  socket: {
    port: socketPort,
  },
})
app.setup()
app.start()
