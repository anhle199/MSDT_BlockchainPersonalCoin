import WebSocket, { Server, WebSocketServer } from 'ws'
import { EVENT_TYPES } from '../constants'
import { BaseSocketController } from '../controllers'
import { SocketServerStorage } from '../global-storage'
import { TSocketServerConfig } from '../types'
import { getSocketRemoteUrl } from '../common'

export class SocketServer {
  protected server: Server

  // states
  private isSetup = false
  private isStart = false

  constructor(protected config: TSocketServerConfig) {
    this.server = new WebSocketServer(config)
    SocketServerStorage.INSTANCE = this
  }

  setup() {
    if (!this.isSetup) {
      const controllers = this.config.controllers ?? []

      this.server.on('connection', socket => {
        console.log(`[socket-server-connection]: ${getSocketRemoteUrl(socket)}`)

        SocketServerStorage.SOCKETS.push(socket)

        for (const controller of controllers) {
          this.addController(controller, socket, [EVENT_TYPES.ALL, EVENT_TYPES.SERVER])
        }
      })

      this.isSetup = true
    }
  }

  start() {
    if (!this.isSetup) {
      throw Error('The socket server must be configured before starting, call setup() method to configure')
    }

    if (!this.isStart) {
      this.isStart = true
      console.log(`Socket server is running on port: ${this.config.port}`)
    }
  }

  private addController(controller: BaseSocketController, socket: WebSocket, eventTypes: EVENT_TYPES[]) {
    const eventSpecs = controller._getEventSpecs().filter(it => eventTypes.includes(it.eventType))

    for (const spec of eventSpecs) {
      socket.on(spec.eventName, (args) => {
        console.log('args', args)
        spec.callback.call(controller, socket, args) 
      })
    }
  }

  connectToAnotherServer(connectionUrl: string) {
    const client = new WebSocket(connectionUrl)

    const controllers = this.config.controllers ?? []
    client.on('open', () => {
      console.log(`[socket-client-open]: ${connectionUrl}`)

      SocketServerStorage.SOCKETS.push(client)

      for (const controller of controllers) {
        this.addController(controller, client, [EVENT_TYPES.ALL, EVENT_TYPES.CLIENT])
      }
    })

    client.on('error', () => {
      console.log(`[socket-client-error]: connection error ${connectionUrl}`)
    })
  }
}