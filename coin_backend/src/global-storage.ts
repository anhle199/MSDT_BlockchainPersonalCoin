import { Block } from './models'
import { TApplicationStorage, TSocketServerStorage } from './types'

const GENESIS_BLOCK = new Block({
  index: 0,
  hash: '4554647a7bb0374593c7cdf952f527d81813a5e876606fa788a9be0fdd85900d',
  previousHash: '',
  timestamp: 1689671599,
  data: 'this is genesis block',
  difficulty: 0,
  nonce: 0,
})

// socket server level storage
export const ApplicationStorage: TApplicationStorage = {
  GENESIS_BLOCK: GENESIS_BLOCK,
  BLOCKCHAIN: [GENESIS_BLOCK],
}

// socket server level storage
export const SocketServerStorage: TSocketServerStorage = {
  SOCKETS: [],
}