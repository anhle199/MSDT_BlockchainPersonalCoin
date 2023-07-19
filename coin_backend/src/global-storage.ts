import { Block } from './models'
import { TApplicationStorage, TSocketServerStorage } from './types'

const GENESIS_BLOCK = new Block({
  index: 0,
  hash: 'c5d8745eb27754730eb888303f2be1cb231424d19c62a2ef75929f09c7345399',
  previousHash: '',
  timestamp: 1689671599,
  data: [],
  difficulty: 0,
  nonce: 0,
})

// socket server level storage
export const ApplicationStorage: TApplicationStorage = {
  GENESIS_BLOCK: GENESIS_BLOCK,
  BLOCKCHAIN: [GENESIS_BLOCK],
  UNSPENT_TRANSACTION_OUTPUTS: [],
}

// socket server level storage
export const SocketServerStorage: TSocketServerStorage = {
  SOCKETS: [],
}
