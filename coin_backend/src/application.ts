import { RestServer, SocketServer } from './servers'
import { TApplicationConfig } from './types'

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
  }

  start() {
    this.restServer.start()
    this.socketServer.start()
  }
}
