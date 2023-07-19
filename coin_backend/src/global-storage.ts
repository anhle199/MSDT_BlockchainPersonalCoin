import { COINBASE_AMOUNT } from './constants'
import { Block, Transaction, TransactionInput, TransactionOutput } from './models'
import { TApplicationStorage, TSocketServerStorage } from './types'

const GENESIS_TRANSACTION = new Transaction({
  id: '4186dca35da0d355e9bcfd661e0b8183bbb33292008320e68efac08c0e01198b',
  inputs: [new TransactionInput({ outputId: '', outputIndex: 0, signature: '' })],
  outputs: [
    new TransactionOutput({
      address:
        '04ebb841a072861713a557edf5dd17132bdfcc43081568f025ca9cb88c18c0a15c4a41a60f58fd626f878b0f1fbf88462d9accc83909db059389e68114a0f31837',
      amount: COINBASE_AMOUNT,
    }),
  ],
})
const GENESIS_BLOCK = new Block({
  index: 0,
  hash: 'c1e74dc402f91947be3a862d9d4eb599469be4d6c90c6dcb20faaed2a2d5e697',
  previousHash: '',
  timestamp: 1689671599,
  data: [GENESIS_TRANSACTION],
  difficulty: 0,
  nonce: 0,
})

// socket server level storage
export const ApplicationStorage: TApplicationStorage = {
  GENESIS_BLOCK: GENESIS_BLOCK,
  BLOCKCHAIN: [GENESIS_BLOCK],
  UNSPENT_TRANSACTION_OUTPUTS: [],
  TRANSACTION_POOL: [],
}

// socket server level storage
export const SocketServerStorage: TSocketServerStorage = {
  SOCKETS: [],
}
