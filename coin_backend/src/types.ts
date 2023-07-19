import { Request, Response } from 'express'
import WebSocket from 'ws'
import { EVENT_TYPES, HTTP_METHODS, SOCKET_MESSAGE_TYPES } from './constants'
import { BaseRestController, BaseSocketController } from './controllers'
import { Block } from './models'
import { SocketServer } from './servers'

export type TApplicationStorage = {
  GENESIS_BLOCK: Block
  BLOCKCHAIN: Block[]
}

export type TSocketServerStorage = {
  SOCKETS: WebSocket[]
  INSTANCE?: SocketServer
}

export type TRestServerConfig = {
  port: number
  controllers?: BaseRestController[]
}

export type TSocketServerConfig = {
  port: number
  controllers?: BaseSocketController[]
}

export type TApplicationConfig = {
  rest: TRestServerConfig
  socket: TSocketServerConfig
}

export type TApiSpec = {
  httpMethod: HTTP_METHODS
  path: string
  controllerMethod: (request: Request, response: Response) => any
}

export type TSocketEventSpec = {
  eventName: string
  eventType: EVENT_TYPES
  callback: Function
}

export type TMessage<Data = any> = {
  type: SOCKET_MESSAGE_TYPES
  data: Data
}
