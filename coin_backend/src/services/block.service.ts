import {
  accumulateDifficulty,
  broadcastLatestBlock,
  calculateBlockHash,
  calculateNewBlockDifficulty,
  findNonce,
  getCurrentTimestamp,
  getLatestBlock,
  hashMatchesDifficulty,
  validateBlockTimestamp,
} from '../common'
import { SECURITY_BLOCK_TIMESTAMP } from '../constants'
import { ApplicationStorage } from '../global-storage'
import { Block } from '../models'

export class BlockService {
  generateNewBlock(data: string, prevBlock: Block) {
    const index = prevBlock.index + 1
    const previousHash = prevBlock.hash
    const timestamp = getCurrentTimestamp()
    const difficulty = calculateNewBlockDifficulty(ApplicationStorage.BLOCKCHAIN)
    const nonce = findNonce(index, previousHash, timestamp, data, difficulty)
    const hash = calculateBlockHash({ index, previousHash, timestamp, data, difficulty, nonce })
    return new Block({ index, hash, previousHash, timestamp, data, difficulty, nonce })
  }

  generateNextBlock(data: string) {
    const nextBlock = this.generateNewBlock(data, getLatestBlock())
    if (this.addBlockToChain(nextBlock)) {
      broadcastLatestBlock()
      return nextBlock
    }

    return null
  }

  validateNewBlock(newBlock: Block, prevBlock: Block) {
    if (newBlock.index !== prevBlock.index + 1) {
      console.log(`invalid index, new: ${newBlock.index}, prev: ${prevBlock.index}`)
      return false
    }

    if (!validateBlockTimestamp(newBlock, prevBlock)) {
      console.log(
        `invalid timestamp, new: ${newBlock.timestamp}, prev: ${prevBlock.timestamp}, security: ${SECURITY_BLOCK_TIMESTAMP}`,
      )
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

    if (!hashMatchesDifficulty(newBlock.hash, newBlock.difficulty)) {
      console.log(`difficulty doesn't match to hash, hash: ${newBlock.hash}, difficulty: ${newBlock.difficulty}`)
      return false
    }

    return true
  }

  validateChain(chain: Block[]) {
    const genesisBlock = chain[0]
    if (JSON.stringify(genesisBlock) === JSON.stringify(ApplicationStorage.GENESIS_BLOCK)) {
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
      ApplicationStorage.BLOCKCHAIN.push(newBlock)
      return true
    }

    return false
  }

  replaceChain(newChain: Block[]) {
    if (this.validateChain(newChain)) {
      const currenctCumulativeDifficulty = accumulateDifficulty(ApplicationStorage.BLOCKCHAIN)
      const newCumulativeDifficulty = accumulateDifficulty(newChain)

      if (newCumulativeDifficulty > currenctCumulativeDifficulty) {
        console.log(`replacing current chain by new chain`)
        ApplicationStorage.BLOCKCHAIN = newChain
        broadcastLatestBlock()
      }
    } else {
      console.log("failed to replace new chain because it's an invalid chain")
    }
  }
}
