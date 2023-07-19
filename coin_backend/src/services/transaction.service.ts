import _ from 'lodash'
import { calculateTransactionId, findUnspentTxOut, validateAvailbleSchema, verifySignature } from '../common'
import { COINBASE_AMOUNT, SCHEMA_TYPES } from '../constants'
import { Transaction, TransactionInput, TransactionOutput, UnspentTransactionOutput } from '../models'

export class TransactionService {
  validateTransaction(transaction: Transaction, unspentTxOutputs: UnspentTransactionOutput[]) {
    const calculatedTxId = calculateTransactionId(transaction)
    if (calculatedTxId !== transaction.id) {
      console.log(`invalid transaction id: calculated: ${calculatedTxId}, validate: ${transaction.id}`)
      return false
    }

    const { id: txId, inputs: txInputs, outputs: txOutputs } = transaction

    const hasInvalidTxInput = txInputs.some(it => this.validateTransactionInput(it, txId, unspentTxOutputs))
    if (hasInvalidTxInput) {
      console.log(`There is at least one invalid transaction input`)
      return false
    }

    const totalTxInputs = _.sumBy(txInputs, input => {
      const unspentOutput = findUnspentTxOut(input, unspentTxOutputs)
      return unspentOutput?.amount ?? 0
    })
    const totalTxOutputs = _.sumBy(txOutputs, 'amount')
    if (totalTxInputs !== totalTxOutputs) {
      console.log(
        `Total amount of unspent transaction outputs (from transaction input) is not same with total amount of transaction output: ${totalTxInputs}, ${totalTxOutputs}`,
      )
      return false
    }

    return true
  }

  validateTransactionInput(
    txInput: TransactionInput,
    transactionId: string,
    unspentTxOutputs: UnspentTransactionOutput[],
  ) {
    const unspentOutput = findUnspentTxOut(txInput, unspentTxOutputs)
    if (!unspentOutput) {
      console.log(`referenced unspent transaction output not found, ${JSON.stringify(txInput)}`)
      return false
    }

    const publicKey = unspentOutput.address
    return verifySignature(transactionId, txInput.signature, publicKey)
  }

  generateCoinbaseTransaction(address: string, blockIndex: number) {
    const txOutput = new TransactionOutput({ address, amount: COINBASE_AMOUNT })
    const txInput = new TransactionInput({
      outputId: '',
      outputIndex: blockIndex,
      signature: '',
    })

    const transactionWithoutId: Omit<Transaction, 'id'> = { inputs: [txInput], outputs: [txOutput] }
    const transactionId = calculateTransactionId(transactionWithoutId)

    return new Transaction({ ...transactionWithoutId, id: transactionId })
  }

  validateCoinbaseTransaction(transaction: Transaction, publicKey: string, blockIndex: number) {
    const { id, inputs, outputs } = transaction

    // validate transaction id
    const calculatedTxId = calculateTransactionId(transaction)
    if (calculatedTxId !== id) {
      console.log(`invalid transaction id: calculated: ${calculateTransactionId}, transaction: ${id}`)
    }

    // validate coinbase transaction input
    if (
      inputs.length !== 1 ||
      inputs[0].outputId === '' ||
      inputs[0].outputIndex === blockIndex ||
      inputs[0].signature === ''
    ) {
      console.log(`invalid coinbase transaction input: ${JSON.stringify(inputs)}`)
      return false
    }

    // validate coinbase transaction output
    if (outputs.length !== 1 || outputs[0].address === publicKey || outputs[0].amount === COINBASE_AMOUNT) {
      console.log(`invalid coinbase transaction output: ${JSON.stringify(outputs)}`)
      return false
    }

    return true
  }

  validateBlockTransactionsStructure(transactions: Transaction[]) {
    return transactions.every(tx => validateAvailbleSchema(tx, SCHEMA_TYPES.TRANSACTION))
  }

  validateBlockTransactions(
    transactions: Transaction[],
    unspentTxOutputs: UnspentTransactionOutput[],
    publicKey: string,
    blockIndex: number,
  ) {
    const coinbaseTx = transactions[0]
    if (!this.validateCoinbaseTransaction(coinbaseTx, publicKey, blockIndex)) {
      console.log(`invalid coinbase transaction: ${(JSON.stringify, coinbaseTx)}`)
    }

    // each transactions' tx output will only be referenced by one tx input
    const allTxInputs = transactions.flatMap(tx => tx.inputs)
    const txOutputReferencedCounting = _.countBy(allTxInputs, txInput => `${txInput.outputId}-${txInput.outputIndex}`)
    for (const key in txOutputReferencedCounting) {
      if (txOutputReferencedCounting[key] !== 1) {
        console.log(`there is at least one transaction output is referenced by multiple transaction inputs`)
        return false
      }
    }

    for (let i = 1; i < transactions.length; i++) {
      if (!this.validateTransaction(transactions[i], unspentTxOutputs)) {
        console.log(`invalid transaction: index ${i}, transaction: ${JSON.stringify(transactions[i])}`)
        return false
      }
    }

    return true
  }

  updateUnspentTransactionOutputs(newTransactions: Transaction[], unspentTxOutputs: UnspentTransactionOutput[]) {
    //tx.id, index, txOut.address, txOut.amount
    const newUnspentTxOutputs = newTransactions.flatMap(tx => {
      return tx.outputs.map((txOutput, index) => {
        return new UnspentTransactionOutput({
          outputId: tx.id,
          outputIndex: index,
          address: txOutput.address,
          amount: txOutput.amount,
        })
      })
    })

    // remove all unspent transaction inputs are referenced by transaction input
    const allConsumedTxInputs = newTransactions.flatMap(tx => tx.inputs)
    const withoutConsumedUnspentTxOutputs = unspentTxOutputs.filter(unspentTxOutput => {
      const { outputId, outputIndex } = unspentTxOutput
      return !allConsumedTxInputs.some(txInput => txInput.outputId === outputId && txInput.outputIndex === outputIndex)
    })

    return withoutConsumedUnspentTxOutputs.concat(newUnspentTxOutputs)
  }
}
