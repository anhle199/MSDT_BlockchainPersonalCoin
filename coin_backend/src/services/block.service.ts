import { calculateBlockHash, getCurrentTimestamp, getLatestBlock } from '../common'
import { AppConstants } from '../constants'
import { Block } from '../models'

export class BlockService {
  generateNewBlock(data: string, prevBlock: Block) {
    const index = prevBlock.index + 1
    const previousHash = prevBlock.hash
    const timestamp = getCurrentTimestamp()
    const hash = calculateBlockHash({ index, previousHash, timestamp, data })
    return new Block({ index, hash, previousHash, timestamp, data })
  }

  validateNewBlock(newBlock: Block, prevBlock: Block) {
    if (newBlock.index !== prevBlock.index + 1) {
      console.log(`invalid index, new: ${newBlock.index}, prev: ${prevBlock.index}`)
      return false
    }

    if (newBlock.previousHash !== prevBlock.hash) {
      console.log(`invalid previous hash, new: ${newBlock.previousHash}, prev: ${prevBlock.hash}`)
      return false
    }

    const calculatedHash = calculateBlockHash(newBlock)
    if (newBlock.hash !== calculatedHash) {
      console.log(`invalid hash, new: ${newBlock.hash}, calculated: ${calculatedHash}`)
      return false
    }

    return true
  }

  validateChain(chain: Block[]) {
    const genesisBlock = chain[0]
    if (JSON.stringify(genesisBlock) === JSON.stringify(AppConstants.GENESIS_BLOCK)) {
      console.log('invalid genesis block')
      return false
    }

    for (let i = 1; i < chain.length; i++) {
      if (!this.validateNewBlock(chain[i], chain[i - 1])) {
        console.log(`invalid two adjacent blocks, indexes: ${i - 1} and ${i}`)
        return false
      }
    }

    return true
  }

  addBlockToChain(newBlock: Block) {
    if (this.validateNewBlock(newBlock, getLatestBlock())) {
      AppConstants.BLOCKCHAIN.push(newBlock)
      return true
    }

    return false
  }

  replaceChain(newChain: Block[]) {
    if (this.validateChain(newChain) && newChain.length > AppConstants.BLOCKCHAIN.length) {
      console.log(`replacing current chain by new chain`)
      AppConstants.BLOCKCHAIN = newChain
      //broadcastLatest()
    } else {
      console.log("failed to replace new chain because it's an invalid chain")
    }
  }
}
