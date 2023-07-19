import WebSocket from 'ws'
import { BLOCKCHAIN_MESSAGE_TYPES } from '../constants'
import { SocketServerStorage } from '../global-storage'
import { BlockchainMessageProvider } from '../providers'
import { TMessage } from '../types'
import { isString } from './validation'

export const getSocketRemoteUrl = (ws: any) => {
  // client close
  const connectionUrl = ws._url

  // server close
  const remoteUrl = ws._socket.remoteAddress + ':' + ws._socket.remotePort

  return connectionUrl ?? remoteUrl
}

export const sendMessage = (ws: WebSocket, message: TMessage | string) => {
  const messageToSend = isString(message) ? message : JSON.stringify(message)
  ws.send(messageToSend)
}

export const broadcast = (message: TMessage | string) => {
  const messageToSend = isString(message) ? message : JSON.stringify(message)
  SocketServerStorage.SOCKETS.forEach(ws => {
    sendMessage(ws, messageToSend)
  })
}

export const broadcastLatestBlock = () => {
  const blockchainMessageType = BLOCKCHAIN_MESSAGE_TYPES.RESPONSE_LATEST_BLOCK
  const messageToSend = BlockchainMessageProvider.instance.getMessage(blockchainMessageType)
  broadcast(messageToSend)
}
