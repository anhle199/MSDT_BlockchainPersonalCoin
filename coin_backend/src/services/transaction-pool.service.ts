import _ from 'lodash'
import { includeUnspentTxOutput } from '../common'
import { ApplicationStorage } from '../global-storage'
import { Transaction, UnspentTransactionOutput } from '../models'
import { TransactionService } from './transaction.service'

export class TransactionPoolService {
  transactionService: TransactionService

  constructor(transactionService?: TransactionService) {
    this.transactionService = transactionService ?? new TransactionService()
  }

  validateTransactionForPool(transaction: Transaction, txPool: Transaction[]) {
    const txInputsInPool = txPool.flatMap(tx => tx.inputs)

    for (const txInput of transaction.inputs) {
      const hasContainTxInput = txInputsInPool.some(
        it => it.outputId === txInput.outputId && it.outputIndex === txInput.outputIndex,
      )

      if (hasContainTxInput) {
        return false
      }
    }

    return true
  }

  addToTransactionPool(transaction: Transaction, unspentTxOutputs: UnspentTransactionOutput[]) {
    if (!this.transactionService.validateTransaction(transaction, unspentTxOutputs)) {
      return false
    }

    if (!this.validateTransactionForPool(transaction, ApplicationStorage.TRANSACTION_POOL)) {
      return false
    }

    console.log(`adding transaction to pool: ${JSON.stringify(transaction)}`)
    ApplicationStorage.TRANSACTION_POOL.push(transaction)
    return true
  }

  updateTransactionPool(unspentTxOutputs: UnspentTransactionOutput[]) {
    const invalidTransactions = []
    const currentPool = ApplicationStorage.TRANSACTION_POOL

    for (const tx of currentPool) {
      for (const txInput of tx.inputs) {
        if (!includeUnspentTxOutput(unspentTxOutputs, txInput)) {
          invalidTransactions.push(tx)
        }
      }
    }

    if (invalidTransactions.length > 0) {
      console.log(`removing the following transactions from pool: ${JSON.stringify(invalidTransactions)}`)
      ApplicationStorage.TRANSACTION_POOL = _.without(ApplicationStorage.TRANSACTION_POOL, ...invalidTransactions)
    }
  }
}
