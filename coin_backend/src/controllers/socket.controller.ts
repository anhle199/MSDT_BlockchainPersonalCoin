import WebSocket from 'ws'
import {
  broadcast,
  broadcastLatestBlock,
  broadcastTransactionPool,
  getLatestBlock,
  getSocketRemoteUrl,
  isUndefined,
  safeParseJson,
  sendMessage,
  validateAvailbleSchema,
} from '../common'
import { BLOCKCHAIN_MESSAGE_TYPES, EVENT_TYPES, SCHEMA_TYPES, SOCKET_MESSAGE_TYPES } from '../constants'
import { ApplicationStorage, SocketServerStorage } from '../global-storage'
import { Block, Transaction } from '../models'
import { BlockchainMessageProvider } from '../providers'
import { BlockService, TransactionPoolService } from '../services'
import { TMessage, TSocketEventSpec } from '../types'
import { BaseSocketController } from './base'

export class SocketController extends BaseSocketController {
  eventSpecs: TSocketEventSpec[]
  blockService: BlockService
  transactionPoolService: TransactionPoolService

  constructor() {
    super()

    this.blockService = new BlockService()
    this.transactionPoolService = new TransactionPoolService()
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

  // message: Buffer
  handleMessageEvent(socket: WebSocket, message: string) {
    console.log(`[socket-message]: ${getSocketRemoteUrl(socket)}, ${message}`)

    const jsonMessage = safeParseJson<TMessage>(message)
    if (isUndefined(jsonMessage)) {
      console.log('Could not parse received JSON message')
      return
    }

    const { type: messageType, data } = jsonMessage

    // respond to sender
    let blockchainMessageType: BLOCKCHAIN_MESSAGE_TYPES
    let messageToSend: TMessage

    switch (messageType) {
      case SOCKET_MESSAGE_TYPES.QUERY_LATEST_BLOCK:
        blockchainMessageType = BLOCKCHAIN_MESSAGE_TYPES.RESPONSE_LATEST_BLOCK
        messageToSend = BlockchainMessageProvider.instance.getMessage(blockchainMessageType)
        sendMessage(socket, messageToSend)
        break
      case SOCKET_MESSAGE_TYPES.QUERY_CHAIN:
        blockchainMessageType = BLOCKCHAIN_MESSAGE_TYPES.RESPONSE_CHAIN
        messageToSend = BlockchainMessageProvider.instance.getMessage(blockchainMessageType)
        sendMessage(socket, messageToSend)
        break
      case SOCKET_MESSAGE_TYPES.RESPONSE_CHAIN:
        const receivedBlocks = safeParseJson<Block[]>(data)
        if (receivedBlocks) {
          this.handleBlockchainResponse(receivedBlocks)
        }
        break
      case SOCKET_MESSAGE_TYPES.QUERY_TRANSACTION_POOL:
        blockchainMessageType = BLOCKCHAIN_MESSAGE_TYPES.RESPONSE_TRANSACTION_POOL
        messageToSend = BlockchainMessageProvider.instance.getMessage(blockchainMessageType)
        sendMessage(socket, messageToSend)
        break
      case SOCKET_MESSAGE_TYPES.RESPONSE_TRANSACTION_POOL:
        const receivedTransactions = safeParseJson<Transaction[]>(data)
        if (receivedTransactions) {
          this.handleTransactionPoolResponse(receivedTransactions)
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
      console.log('Received block chain size of 0')
      return
    }

    if (receivedBlocks.some(block => !validateAvailbleSchema(block, SCHEMA_TYPES.BLOCK))) {
      console.log('There is at least one received block which is invalid')
      return
    }

    const latestBlockReceived = receivedBlocks[receivedBlocks.length - 1]
    const latestBlockHeld = getLatestBlock()

    if (latestBlockReceived.index > latestBlockHeld.index) {
      console.log(
        `Blockchain possibly behind. latest current index: ${latestBlockHeld.index}, received latest index: ${latestBlockReceived.index}`,
      )
      if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
        if (this.blockService.addBlockToChain(latestBlockReceived)) {
          broadcastLatestBlock()
        }
      } else if (receivedBlocks.length === 1) {
        console.log('We have to query the chain from our peer')
        const message = BlockchainMessageProvider.instance.getMessage(BLOCKCHAIN_MESSAGE_TYPES.QUERY_CHAIN)
        broadcast(message)
      } else {
        console.log('Received blockchain is longer than current blockchain')
        this.blockService.replaceChain(receivedBlocks)
      }
    } else {
      console.log('Received blockchain is not longer than received blockchain. Do nothing')
    }
  }

  private handleTransactionPoolResponse(receivedTransactions: Transaction[]) {
    receivedTransactions.forEach(transaction => {
      const isAdded = this.transactionPoolService.addToTransactionPool(
        transaction,
        ApplicationStorage.UNSPENT_TRANSACTION_OUTPUTS,
      )

      if (isAdded) {
        broadcastTransactionPool()
      }
    })
  }
}
