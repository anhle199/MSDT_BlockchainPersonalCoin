import WebSocket from 'ws'
import {
  broadcast,
  broadcastLatestBlock,
  getLatestBlock,
  getSocketRemoteUrl,
  isUndefined,
  safeParseJson,
  sendMessage,
} from '../common'
import { BLOCKCHAIN_MESSAGE_TYPES, EVENT_TYPES, SOCKET_MESSAGE_TYPES } from '../constants'
import { SocketServerStorage } from '../global-storage'
import { Block } from '../models'
import { BlockchainMessageProvider } from '../providers'
import { BlockService } from '../services'
import { TMessage, TSocketEventSpec } from '../types'
import { BaseSocketController } from './base'

export class SocketController extends BaseSocketController {
  eventSpecs: TSocketEventSpec[]
  blockService: BlockService

  constructor() {
    super()

    this.blockService = new BlockService()
    this.eventSpecs = [
      {
        eventName: 'message',
        eventType: EVENT_TYPES.ALL,
        callback: this.handleMessageEvent,
      },
      {
        eventName: 'close',
        eventType: EVENT_TYPES.ALL,
        callback: this.handleCloseConnection,
      },
      {
        eventName: 'error',
        eventType: EVENT_TYPES.SERVER,
        callback: this.handleConnectionError,
      },
    ]
  }

  handleMessageEvent(socket: WebSocket, message: string) {
    console.log(`[socket-message]: ${socket}, ${message}`)
    console.log(`[socket-message]: Received message`, message)

    const jsonMessage = safeParseJson<TMessage>(message)
    if (isUndefined(jsonMessage)) {
      console.log('Could not parse received JSON message')
      return
    }

    console.log('Received message' + JSON.stringify(message))
    const { type: messageType, data } = jsonMessage

    // respond to sender
    let blockchainMessageType: BLOCKCHAIN_MESSAGE_TYPES
    let messageToSend: TMessage

    switch (messageType) {
      case SOCKET_MESSAGE_TYPES.QUERY_LATEST_BLOCK:
        blockchainMessageType = BLOCKCHAIN_MESSAGE_TYPES.QUERY_LATEST_BLOCK
        messageToSend = BlockchainMessageProvider.instance.getMessage(blockchainMessageType)
        sendMessage(socket, messageToSend)
        break
      case SOCKET_MESSAGE_TYPES.QUERY_CHAIN:
        blockchainMessageType = BLOCKCHAIN_MESSAGE_TYPES.QUERY_CHAIN
        messageToSend = BlockchainMessageProvider.instance.getMessage(blockchainMessageType)
        sendMessage(socket, messageToSend)
        break
      case SOCKET_MESSAGE_TYPES.RESPONSE_CHAIN:
        const receivedBlocks: Block[] = data
        if (receivedBlocks !== null) {
          this.handleBlockchainResponse(receivedBlocks)
        }
        break
    }
  }

  handleCloseConnection(socket: WebSocket) {
    console.log(`[socket-close]: ${getSocketRemoteUrl(socket)}`)
    const index = SocketServerStorage.SOCKETS.indexOf(socket)
    SocketServerStorage.SOCKETS.splice(index, 1)
  }

  handleConnectionError(socket: WebSocket) {
    console.log(`[socket-error]: ${getSocketRemoteUrl(socket)}`)
    const index = SocketServerStorage.SOCKETS.indexOf(socket)
    SocketServerStorage.SOCKETS.splice(index, 1)
  }

  private handleBlockchainResponse(receivedBlocks: Block[]) {
    if (receivedBlocks.length === 0) {
      console.log('received block chain size of 0')
      return
    }

    const safeReceivedBlocks = receivedBlocks.map(block => Block.from(block)) as Block[]
    if (safeReceivedBlocks.some(block => isUndefined(block))) {
      console.log('There is at least one received block which is invalid')
      return
    }

    const latestBlockReceived = safeReceivedBlocks[safeReceivedBlocks.length - 1]
    const latestBlockHeld = getLatestBlock()

    if (latestBlockReceived.index > latestBlockHeld.index) {
      console.log(
        `Blockchain possibly behind. latest current index: ${latestBlockHeld.index}, received latest index: ${latestBlockReceived.index}`,
      )
      if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
        if (this.blockService.addBlockToChain(latestBlockReceived)) {
          broadcastLatestBlock()
        }
      } else if (safeReceivedBlocks.length === 1) {
        console.log('We have to query the chain from our peer')
        const message = BlockchainMessageProvider.instance.getMessage(BLOCKCHAIN_MESSAGE_TYPES.QUERY_CHAIN)
        broadcast(message)
      } else {
        console.log('Received blockchain is longer than current blockchain')
        this.blockService.replaceChain(safeReceivedBlocks)
      }
    } else {
      console.log('received blockchain is not longer than received blockchain. Do nothing')
    }
  }
}
