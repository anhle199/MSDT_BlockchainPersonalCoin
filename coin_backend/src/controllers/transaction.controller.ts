import { Request, Response } from 'express'
import { broadcastTransactionPool, isString } from '../common'
import { HTTP_METHODS } from '../constants'
import { ApplicationStorage } from '../global-storage'
import { TransactionPoolService, TransactionService } from '../services'
import { TApiSpec } from '../types'
import { Wallet } from '../wallet'
import { BaseRestController } from './base'

export class TransactionController extends BaseRestController {
  apiSpecs: TApiSpec[]
  transactionService: TransactionService
  transactionPoolService: TransactionPoolService

  constructor() {
    super()

    this.transactionService = new TransactionService()
    this.transactionPoolService = new TransactionPoolService()
    this.apiSpecs = [
      {
        httpMethod: HTTP_METHODS.GET,
        path: '/transactions/unspentOutputs',
        controllerMethod: this.getAllUnspentTransactionOutputs,
      },
      {
        httpMethod: HTTP_METHODS.GET,
        path: '/transactions/pool',
        controllerMethod: this.getTransactionPool,
      },
      {
        httpMethod: HTTP_METHODS.GET,
        path: '/transactions/:id',
        controllerMethod: this.getTransactionById,
      },
      {
        httpMethod: HTTP_METHODS.POST,
        path: '/transactions/sendAmount',
        controllerMethod: this.sendTransactionWithAmount,
      },
      {
        httpMethod: HTTP_METHODS.POST,
        path: '/transactions/sendSigned',
        controllerMethod: this.sendSignedTransaction,
      },
    ]
  }

  getAllUnspentTransactionOutputs(request: Request, response: Response) {
    response.send(ApplicationStorage.UNSPENT_TRANSACTION_OUTPUTS)
  }

  getTransactionPool(request: Request, response: Response) {
    response.send(ApplicationStorage.TRANSACTION_POOL)
  }

  getTransactionById(request: Request, response: Response) {
    const id = request.params.id

    if (!isString(id)) {
      return response.status(422).send({
        error: {
          code: 'INVALID_PATH_PARAMETERS',
          message: 'Invalid transaction id',
        },
      })
    }

    const allConfirmedTransactions = ApplicationStorage.BLOCKCHAIN.flatMap(block => block.data)
    const transaction = allConfirmedTransactions.find(tx => tx.id === id)
    if (!transaction) {
      return response.status(404).send({
        error: {
          code: 'TRANSACTION_NOT_FOUND',
          message: 'Transaction not found',
        },
      })
    }

    response.send(transaction)
  }

  sendTransactionWithAmount(request: Request, response: Response) {
    const address = String(request.body.address)
    const amount = Number(request.body.amount)

    const transaction = this.transactionService.createTransaction(
      address,
      amount,
      Wallet.instance.getPrivateKey(),
      ApplicationStorage.UNSPENT_TRANSACTION_OUTPUTS,
      ApplicationStorage.TRANSACTION_POOL,
    )
    if (!transaction) {
      return response.status(400).send({
        error: {
          code: 'FAILED_TO_CREATE_TRANSACTION',
          message: 'Failed to create transaction',
        },
      })
    }

    const isAdded = this.transactionPoolService.addToTransactionPool(
      transaction,
      ApplicationStorage.UNSPENT_TRANSACTION_OUTPUTS,
    )
    if (!isAdded) {
      return response.status(400).send({
        error: {
          code: 'FAILED_TO_ADD_TO_TRANSACTION_POOL',
          message: 'Failed to add to transaction pool',
        },
      })
    }

    broadcastTransactionPool()
    response.send(transaction)
  }

  sendSignedTransaction(request: Request, response: Response) {
    const transaction = request.body
    const isAdded = this.transactionPoolService.addToTransactionPool(
      transaction,
      ApplicationStorage.UNSPENT_TRANSACTION_OUTPUTS,
    )
    if (!isAdded) {
      return response.status(400).send({
        error: {
          code: 'FAILED_TO_SEND_SIGNED_TRANSACTION',
          message: 'Failed to send signed transaction, cannot add to transaction pool',
        },
      })
    }

    broadcastTransactionPool()
    response.send(transaction)
  }
}
