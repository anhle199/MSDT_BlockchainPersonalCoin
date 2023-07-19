import { JSONSchemaType } from 'ajv'

export class UnspentTransactionOutput {
  readonly outputId: string
  readonly outputIndex: number
  readonly address: string
  readonly amount: number

  constructor(unspentOutput: UnspentTransactionOutput) {
    this.outputId = unspentOutput.outputId
    this.outputIndex = unspentOutput.outputIndex
    this.address = unspentOutput.address
    this.amount = unspentOutput.amount
  }
}

export class TransactionInput {
  outputId: string
  outputIndex: number
  signature: string

  constructor(input: TransactionInput) {
    this.outputId = input.outputId
    this.outputIndex = input.outputIndex
    this.signature = input.signature
  }
}

export class TransactionOutput {
  address: string
  amount: number

  constructor(output: TransactionOutput) {
    this.address = output.address
    this.amount = output.amount
  }
}

export class Transaction {
  id: string
  inputs: TransactionInput[]
  outputs: TransactionOutput[]

  constructor(transaction: Transaction) {
    this.id = transaction.id
    this.inputs = transaction.inputs
    this.outputs = transaction.outputs
  }
}

export const UNSPENT_TRANSACTION_OUTPUT_SCHEMA: JSONSchemaType<UnspentTransactionOutput> = {
  type: 'object',
  properties: {
    outputId: {
      type: 'string',
    },
    outputIndex: {
      type: 'integer',
    },
    address: {
      type: 'string',
    },
    amount: {
      type: 'number',
    },
  },
  required: ['outputId', 'outputIndex', 'address', 'amount'],
  additionalProperties: false,
}

export const TRANSACTION_INPUT_SCHEMA: JSONSchemaType<TransactionInput> = {
  type: 'object',
  properties: {
    outputId: {
      type: 'string',
    },
    outputIndex: {
      type: 'integer',
    },
    signature: {
      type: 'string',
    },
  },
  required: ['outputId', 'outputIndex', 'signature'],
  additionalProperties: false,
}

export const TRANSACTION_OUTPUT_SCHEMA: JSONSchemaType<TransactionOutput> = {
  type: 'object',
  properties: {
    address: {
      type: 'string',
      minLength: 130,
      maxLength: 130,
      pattern: '^04[a-fA-F0-9]+$',
    },
    amount: {
      type: 'number',
    },
  },
  required: ['address', 'amount'],
  additionalProperties: false,
}

export const TRANSACTION_SCHEMA: JSONSchemaType<Transaction> = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    inputs: {
      type: 'array',
      items: TRANSACTION_INPUT_SCHEMA,
      minItems: 1,
      maxItems: 1,
    },
    outputs: {
      type: 'array',
      items: TRANSACTION_OUTPUT_SCHEMA,
      minItems: 1,
      maxItems: 1,
    },
  },
  required: ['id', 'inputs', 'outputs'],
  additionalProperties: false,
}
