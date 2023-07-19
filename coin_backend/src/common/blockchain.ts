import { BLOCK_GENERATION_INTERVAL, DIFFICULTY_ADJUSTMENT_INTERVAL, SECURITY_BLOCK_TIMESTAMP } from '../constants'
import { ApplicationStorage } from '../global-storage'
import { Block, Transaction } from '../models'
import { hexToBinary } from './base-number'
import { sha256 } from './crypto'
import { getCurrentTimestamp } from './datetime'

export const calculateBlockHash = (block: Omit<Block, 'hash'>) => {
  const { index, previousHash, timestamp, data, difficulty, nonce } = block

  const transactionDataToHash = data.map(tx => tx.id).toString()
  const inputHash = [
    index.toString(),
    previousHash,
    timestamp.toString(),
    transactionDataToHash,
    difficulty.toString(),
    nonce.toString(),
  ]

  return sha256(inputHash.join(''))
}

export const getLatestBlock = () => ApplicationStorage.BLOCKCHAIN[ApplicationStorage.BLOCKCHAIN.length - 1]

const calculateAdjustedDifficulty = (chain: Block[]) => {
  const latestBlock = chain[chain.length - 1]
  const prevAdjustmentBlock = chain[chain.length - DIFFICULTY_ADJUSTMENT_INTERVAL]
  const timeExpected = BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL
  const timeTaken = latestBlock.timestamp - prevAdjustmentBlock.timestamp

  if (timeTaken < timeExpected / 2) {
    return prevAdjustmentBlock.difficulty + 1
  } else if (timeTaken > timeExpected * 2) {
    return prevAdjustmentBlock.difficulty - 1
  } else {
    return prevAdjustmentBlock.difficulty
  }
}

export const calculateNewBlockDifficulty = (chain: Block[]) => {
  const latestBlock = chain[chain.length - 1]

  if (latestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0 && latestBlock.index !== 0) {
    return calculateAdjustedDifficulty(chain)
  } else {
    return latestBlock.difficulty
  }
}

export const hashMatchesDifficulty = (hash: string, difficulty: number) => {
  const hashInBinary = hexToBinary(hash) ?? ''
  const requiredPrefix = '0'.repeat(difficulty)
  return hashInBinary.startsWith(requiredPrefix)
}

export const findNonce = (index: number, previousHash: string, timestamp: number, data: Transaction[], difficulty: number) => {
  let nonce = 0
  while (true) {
    const hash = calculateBlockHash({ index, previousHash, timestamp, data, difficulty, nonce })
    if (hashMatchesDifficulty(hash, difficulty)) {
      return nonce
    }

    nonce++
  }
}

export const validateBlockTimestamp = (newBlock: Block, prevBlock: Block) => {
  return (
    prevBlock.timestamp - SECURITY_BLOCK_TIMESTAMP < newBlock.timestamp &&
    newBlock.timestamp < getCurrentTimestamp() + SECURITY_BLOCK_TIMESTAMP
  )
}

export const accumulateDifficulty = (chain: Block[]) => {
  return chain.reduce((acc, block) => acc + Math.pow(2, block.difficulty), 0)
}
