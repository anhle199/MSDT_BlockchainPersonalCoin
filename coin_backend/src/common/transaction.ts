import { Transaction, TransactionInput, UnspentTransactionOutput } from '../models'
import { getPublicKeyFromPrivate, sha256, sign } from './crypto'

export const calculateTransactionId = (transaction: Omit<Transaction, 'id'>) => {
  const txInputContent = transaction.inputs.reduce(
    (acc, input) => acc + input.outputId + input.outputIndex.toString(),
    '',
  )

  const txOutputContent = transaction.outputs.reduce(
    (acc, output) => acc + output.address + output.amount.toString(),
    '',
  )

  return sha256(txInputContent + txOutputContent)
}

export const signTransactionInput = (
  txId: string,
  txInput: TransactionInput,
  privateKey: string,
  unspentTxOutputs: UnspentTransactionOutput[],
) => {
  const referencedUnspentTxOutput = findUnspentTxOutput(txInput, unspentTxOutputs)
  if (!referencedUnspentTxOutput) {
    console.log('could not find referenced txOut')
    throw Error()
  }

  const referencedAddress = referencedUnspentTxOutput.address
  if (getPublicKeyFromPrivate(privateKey) !== referencedAddress) {
    console.log(
      'trying to sign an input with private' + ' key that does not match the address that is referenced in txIn',
    )
    throw Error()
  }

  const signature = sign(txId, privateKey)
  return signature
}

export const findUnspentTxOutput = (txInput: TransactionInput, unspentTxOutputs: UnspentTransactionOutput[]) => {
  const { outputId, outputIndex } = txInput
  return unspentTxOutputs.find(it => it.outputId === outputId && it.outputIndex === outputIndex)
}

export const includeUnspentTxOutput = (
  unspentTxOutputs: UnspentTransactionOutput[],
  searchValue: { outputId: string; outputIndex: number },
) => {
  const { outputId, outputIndex } = searchValue
  return unspentTxOutputs.some(it => it.outputId === outputId && it.outputIndex === outputIndex)
}

export const calculateTxOutputsForAmount = (amount: number, unspentTxOutputs: UnspentTransactionOutput[]) => {
  let currentAmount = 0
  const includedUnspentTxOutputs = []

  for (const unspentOutput of unspentTxOutputs) {
    includedUnspentTxOutputs.push(unspentOutput)
    currentAmount = currentAmount + unspentOutput.amount

    if (currentAmount >= amount) {
      const leftOverAmount = currentAmount - amount
      return { includedUnspentTxOutputs, leftOverAmount }
    }
  }

  // return undefined
}
