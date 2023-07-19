import { getLatestBlock } from '../common'
import { BLOCKCHAIN_MESSAGE_TYPES, SOCKET_MESSAGE_TYPES } from '../constants'
import { ApplicationStorage } from '../global-storage'
import { TMessage } from '../types'

export class BlockchainMessageProvider {
  public static instance = new BlockchainMessageProvider()
  private constructor() {}

  getMessage(type: BLOCKCHAIN_MESSAGE_TYPES): TMessage {
    switch (type) {
      case BLOCKCHAIN_MESSAGE_TYPES.QUERY_CHAIN:
        return {
          type: SOCKET_MESSAGE_TYPES.QUERY_CHAIN,
          data: null,
        }
      case BLOCKCHAIN_MESSAGE_TYPES.RESPONSE_CHAIN:
        return {
          type: SOCKET_MESSAGE_TYPES.RESPONSE_CHAIN,
          data: JSON.stringify(ApplicationStorage.BLOCKCHAIN),
        }
      case BLOCKCHAIN_MESSAGE_TYPES.QUERY_LATEST_BLOCK:
        return {
          type: SOCKET_MESSAGE_TYPES.QUERY_LATEST_BLOCK,
          data: null,
        }
      case BLOCKCHAIN_MESSAGE_TYPES.RESPONSE_LATEST_BLOCK:
        return {
          type: SOCKET_MESSAGE_TYPES.RESPONSE_CHAIN,
          data: JSON.stringify([getLatestBlock()]),
        }
      case BLOCKCHAIN_MESSAGE_TYPES.QUERY_TRANSACTION_POOL:
        return {
          type: SOCKET_MESSAGE_TYPES.QUERY_TRANSACTION_POOL,
          data: null,
        }
      case BLOCKCHAIN_MESSAGE_TYPES.RESPONSE_TRANSACTION_POOL:
        return {
          type: SOCKET_MESSAGE_TYPES.RESPONSE_TRANSACTION_POOL,
          data: JSON.stringify(ApplicationStorage.TRANSACTION_POOL),
        }
    }
  }
}
