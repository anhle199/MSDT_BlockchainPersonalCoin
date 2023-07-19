import { Transaction, TransactionInput, UnspentTransactionOutput } from '../models'
import { getPublicKey, sha256, sign } from './crypto'

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
  const referencedUnspentTxOutput = findUnspentTxOut(txInput, unspentTxOutputs)
  if (!referencedUnspentTxOutput) {
    console.log('could not find referenced txOut')
    throw Error()
  }

  const referencedAddress = referencedUnspentTxOutput.address
  if (getPublicKey(privateKey) !== referencedAddress) {
    console.log(
      'trying to sign an input with private' + ' key that does not match the address that is referenced in txIn',
    )
    throw Error()
  }

  const signature = sign(txId, privateKey)
  return signature
}

export const findUnspentTxOut = (txInput: TransactionInput, unspentTxOutputs: UnspentTransactionOutput[]) => {
  return unspentTxOutputs.find(it => it.outputId === txInput.outputId && it.outputIndex === txInput.outputIndex)
}

//export const validateTransactionOutputAddress = (address: string) => {
//if (address.length !== 130) {
//console.log('invalid public key length')
//return false
//}

//if (!address.match('^[a-fA-F0-9]+$')) {
//console.log('public key must contain only hex characters')
//return false
//}

//if (!address.startsWith('04')) {
//console.log('public key must start with 04')
//return false
//}

//return true
//}
