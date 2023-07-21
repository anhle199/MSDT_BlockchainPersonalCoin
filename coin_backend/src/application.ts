import { RestServer, SocketServer } from './servers'
import { TApplicationConfig } from './types'
import { Wallet } from './wallet'

export class Application {
  restServer: RestServer
  socketServer: SocketServer

  constructor(config: TApplicationConfig) {
    this.restServer = new RestServer(config.rest)
    this.socketServer = new SocketServer(config.socket)
  }

  setup() {
    this.restServer.setup()
    this.socketServer.setup()
    Wallet.instance.init()
    console.log(Wallet.instance.getPrivateKey())
    console.log(Wallet.instance.getPublicKey())
  }

  start() {
    this.restServer.start()
    this.socketServer.start()
  }
}
