import { JSONSchemaType } from 'ajv'

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
    this.hash = hash
    this.previousHash = previousHash
    this.timestamp = timestamp
    this.data = data
    this.difficulty = difficulty
    this.nonce = nonce
  }
}

export const BLOCK_SCHEMA: JSONSchemaType<Block> = {
  type: 'object',
  properties: {
    index: {
      type: 'integer',
    },
    hash: {
      type: 'string',
    },
    previousHash: {
      type: 'string',
    },
    timestamp: {
      type: 'number',
    },
    data: {
      type: 'string',
    },
    difficulty: {
      type: 'integer',
    },
    nonce: {
      type: 'integer',
    },
  },
  required: ['index', 'hash', 'previousHash', 'timestamp', 'data', 'difficulty', 'nonce'],
  additionalProperties: false,
}
