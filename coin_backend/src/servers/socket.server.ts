import { TSocketServerConfig } from '../types'
import WebSocket, { Server, WebSocketServer } from 'ws'

export class SocketServer {
  protected server: Server

  // states
  private isSetup = false
  private isStart = false

  constructor(protected config: TSocketServerConfig) {
    this.server = new WebSocketServer(config)
  }

  setup() {
    if (!this.isSetup) {
      this.server.on('connection', socket => {
        console.log('on connection socket')
      })

      this.isSetup = true
    }
  }

  start() {
    if (!this.isStart) {
      this.isStart = true
      console.log(`Socket server is running on port: ${this.config.port}`)
    }
  }
}
