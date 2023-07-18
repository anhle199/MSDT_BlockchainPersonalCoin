import { Block } from '../models'

const GENESIS_BLOCK = new Block({
  index: 0,
  hash: '9434ff30e8a5400d31f1c9851903722d28d6b220a16756de87e53ef37fbd9a56',
  previousHash: '',
  timestamp: 1689671599,
  data: 'this is genesis block',
})

export const AppConstants = {
  GENESIS_BLOCK: GENESIS_BLOCK,
  BLOCKCHAIN: [GENESIS_BLOCK]
}
