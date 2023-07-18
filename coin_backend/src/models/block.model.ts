export class Block {
  index: number
  hash: string
  previousHash: string
  timestamp: number
  data: string

  constructor(block: Block) {
    const { index, previousHash, timestamp, data, hash } = block

    this.index = index
    this.previousHash = previousHash
    this.timestamp = timestamp
    this.data = data
    this.hash = hash
  }
}
