import { Request, Response } from 'express'
import { HTTP_METHODS } from '../constants'
import { SocketServerStorage } from '../global-storage'
import { TApiSpec } from '../types'
import { BaseRestController } from './base'
import { getSocketRemoteUrl } from '../common'

export class P2PController extends BaseRestController {
  apiSpecs: TApiSpec[]

  constructor() {
    super()

    this.apiSpecs = [
      {
        httpMethod: HTTP_METHODS.GET,
        path: '/peers',
        controllerMethod: this.getAllConnections,
      },
      {
        httpMethod: HTTP_METHODS.POST,
        path: '/peers',
        controllerMethod: this.connectToPeer,
      },
    ]
  }

  getAllConnections(request: Request, response: Response) {
    const result = SocketServerStorage.SOCKETS.map(getSocketRemoteUrl)
    response.send(result)
  }

  connectToPeer(request: Request, response: Response) {
    const connectionUrl = String(request.body.connectionUrl)
    SocketServerStorage.INSTANCE?.connectToAnotherServer(connectionUrl)
    response.sendStatus(204)
  }
}
