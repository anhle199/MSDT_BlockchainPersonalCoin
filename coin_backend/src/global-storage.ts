import { COINBASE_AMOUNT } from './constants'
import { Block, Transaction, TransactionInput, TransactionOutput } from './models'
import { TApplicationStorage, TSocketServerStorage } from './types'

const GENESIS_TRANSACTION = new Transaction({
  id: 'f705d94d4a4d922068bf5a11313e3232311f52e13462621aaf19544269843348',
  inputs: [new TransactionInput({ outputId: '', outputIndex: 0, signature: '' })],
  outputs: [
    new TransactionOutput({
      address:
        '04ebb841a072861713a557edf5dd17132bdfcc43081568f025ca9cb88c18c0a15c4a41a60f58fd626f878b0f1fbf88462d9accc83909db059389e68114a0f31837',
      amount: COINBASE_AMOUNT,
    }),
  ],
  timestamp: 1689671590
})
const GENESIS_BLOCK = new Block({
  index: 0,
  hash: '468f3715710b8d8c4e8e04e7ee722e68ff342ff0204a2acf7750df6f52fdb296',
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
