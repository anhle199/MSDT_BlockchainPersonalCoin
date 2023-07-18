import { AppConstants } from '../constants'
import { Block } from '../models'
import { sha256 } from './crypto'

export const calculateBlockHash = (block: Omit<Block, 'hash'>) => {
  const { index, previousHash, timestamp, data } = block
  const inputHash = index.toString() + previousHash + timestamp.toString() + data
  return sha256(inputHash)
}

export const getLatestBlock = () => AppConstants.BLOCKCHAIN[AppConstants.BLOCKCHAIN.length - 1]
