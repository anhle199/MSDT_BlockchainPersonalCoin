import { SHA256 } from 'crypto-js'
import { TTransaction, TTransactionInput, TTransactionOutput, TUnspentTransactionOutput } from '../types'
import { getPublicKeyFromPrivate, sign } from './crypto'
import { getCurrentTimestamp } from './datetime'

const calculateTxOutputsForAmount = (amount: number, unspentTxOutputs: TUnspentTransactionOutput[]) => {
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
}

const createTransactionOutput = (
  receiverAddress: string,
  senderAddress: string,
  amount: number,
  leftOverAmount: number,
) => {
  const txOutputs: TTransactionOutput[] = [{ address: receiverAddress, amount }]
  if (leftOverAmount > 0) {
    txOutputs.push({ address: senderAddress, amount: leftOverAmount })
  }

  return txOutputs
}

const calculateTransactionId = (transaction: Omit<TTransaction, 'id'>) => {
  const txInputContent = transaction.inputs.reduce(
    (acc, input) => acc + input.outputId + input.outputIndex.toString(),
    '',
  )

  const txOutputContent = transaction.outputs.reduce(
    (acc, output) => acc + output.address + output.amount.toString(),
    '',
  )

  return SHA256(txInputContent + txOutputContent + transaction.timestamp.toString()).toString()
}

const findUnspentTxOutput = (txInput: TTransactionInput, unspentTxOutputs: TUnspentTransactionOutput[]) => {
  const { outputId, outputIndex } = txInput
  return unspentTxOutputs.find(it => it.outputId === outputId && it.outputIndex === outputIndex)
}

const signTransactionInput = (
  txId: string,
  txInput: TTransactionInput,
  privateKey: string,
  unspentTxOutputs: TUnspentTransactionOutput[],
) => {
  const referencedUnspentTxOutput = findUnspentTxOutput(txInput, unspentTxOutputs)
  if (!referencedUnspentTxOutput) {
    //console.log('could not find referenced txOut')
    throw Error()
  }

  const referencedAddress = referencedUnspentTxOutput.address
  if (getPublicKeyFromPrivate(privateKey) !== referencedAddress) {
    //console.log(
      //'trying to sign an input with private' + ' key that does not match the address that is referenced in txIn',
    //)
    throw Error()
  }

  const signature = sign(txId, privateKey)
  return signature
}

export const verifyBalanceFromTxOutputs = (amount: number, unspentTxOutputs: TUnspentTransactionOutput[]) => {
  const calculatedTxOutputs = calculateTxOutputsForAmount(amount, unspentTxOutputs)
  return calculatedTxOutputs ? true : false
}

export const createTransaction = (
  receiverAddress: string,
  amount: number,
  privateKey: string,
  publicKey: string,
  unspentTxOutputs: TUnspentTransactionOutput[],
): TTransaction | null => {
  const senderAddress = publicKey

  // filter from unspentOutputs such inputs that are referenced in pool
  const calculatedTxOutputs = calculateTxOutputsForAmount(amount, unspentTxOutputs)
  if (!calculatedTxOutputs) {
    //console.log('Cannot create transaction from the available unspent transaction outputs, not enough amount')
    return null
  }

  const { includedUnspentTxOutputs, leftOverAmount } = calculatedTxOutputs
  const unsignedTxInputs: TTransactionInput[] = includedUnspentTxOutputs.map(it => ({
    outputId: it.outputId,
    outputIndex: it.outputIndex,
    signature: '',
  }))

  const txOutputs = createTransactionOutput(receiverAddress, senderAddress, amount, leftOverAmount)
  const timestamp = getCurrentTimestamp()
  const transactionId = calculateTransactionId({ inputs: unsignedTxInputs, outputs: txOutputs, timestamp })
  const signedTxInputs = unsignedTxInputs.map(it => {
    it.signature = signTransactionInput(transactionId, it, privateKey, unspentTxOutputs)
    return it
  })

  return { id: transactionId, inputs: signedTxInputs, outputs: txOutputs, timestamp }
}

export const validateAddress = (address: string): address is string => {
  const regex = /^04[a-fA-F0-9]+$/
  return typeof address === 'string' && address.length === 130 && regex.test(address)
}
