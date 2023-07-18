import { Request, Response } from 'express'
import { BaseRestController } from './controllers'

export type TRestServerConfig = {
  port: number
  controllers?: BaseRestController[]
}

export type TSocketServerConfig = {
  port: number
}

export type TApplicationConfig = {
  rest: TRestServerConfig
  socket: TSocketServerConfig
}

export type TApiSpec = {
  httpMethod: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  controllerMethod: (request: Request, response: Response) => any
}
