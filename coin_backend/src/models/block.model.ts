import _ from 'lodash'
import { isString, isValidNumber } from '../common'

export class Block {
  index: number
  hash: string
  previousHash: string
  timestamp: number
  data: string
  difficulty: number
  nonce: number

  constructor(block: Block) {
    const { index, previousHash, timestamp, data, hash, difficulty, nonce } = block

    this.index = index
    this.previousHash = previousHash
    this.timestamp = timestamp
    this.data = data
    this.hash = hash
    this.difficulty = difficulty
    this.nonce = nonce
  }

  static from(data: any) {
    if (!_.isPlainObject(data)) return undefined

    const { index, previousHash, timestamp, data: blockData, hash, difficulty, nonce } = data
    if (!isValidNumber(index) || index < 0) return undefined
    if (!isString(previousHash)) return undefined
    if (!isValidNumber(timestamp) || index < 0) return undefined
    if (!isString(blockData)) return undefined
    if (!isString(hash)) return undefined
    if (!isValidNumber(difficulty)) return undefined
    if (!isValidNumber(nonce)) return undefined

    return new Block(data)
  }
}
