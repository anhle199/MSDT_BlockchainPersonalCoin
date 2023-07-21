import { Request, Response } from 'express'
import _ from 'lodash'
import { validateAddress, verifySignature } from '../common'
import { HTTP_METHODS } from '../constants'
import { ApplicationStorage } from '../global-storage'
import { TApiSpec } from '../types'
import { Wallet } from '../wallet'
import { BaseRestController } from './base'

export class WalletController extends BaseRestController {
  apiSpecs: TApiSpec[]

  constructor() {
    super()

    this.apiSpecs = [
      {
        httpMethod: HTTP_METHODS.GET,
        path: '/wallets/address',
        controllerMethod: this.getAccountAddress,
      },
      {
        httpMethod: HTTP_METHODS.GET,
        path: '/wallets/balance',
        controllerMethod: this.getAccountBalance,
      },
      {
        httpMethod: HTTP_METHODS.GET,
        path: '/wallets/:address/balance',
        controllerMethod: this.getAccountBalanceByAddress,
      },
      {
        httpMethod: HTTP_METHODS.GET,
        path: '/wallets/:address/unspentTransactionOutputs',
        controllerMethod: this.getUnspentTransactionOutputsByAddress,
      },
      {
        httpMethod: HTTP_METHODS.GET,
        path: '/wallets/:address/transactions',
        controllerMethod: this.getTransactionsByAddress,
      },
    ]
  }

  getAccountAddress(request: Request, response: Response) {
    response.send({ address: Wallet.instance.getPublicKey() })
  }

  getAccountBalance(request: Request, response: Response) {
    const address = Wallet.instance.getPublicKey()
    const unspentOutputs = ApplicationStorage.UNSPENT_TRANSACTION_OUTPUTS
    const balance = _.sumBy(unspentOutputs, it => (it.address === address ? it.amount : 0))
    response.send({ balance })
  }

  getAccountBalanceByAddress(request: Request, response: Response) {
    const address = request.params.address
    if (!validateAddress(address)) {
      return response.status(422).send({
        error: {
          code: 'INVALID_PATH_PARAMETERS',
          message: 'Invalid address',
        },
      })
    }

    const unspentOutputs = ApplicationStorage.UNSPENT_TRANSACTION_OUTPUTS
    const balance = _.sumBy(unspentOutputs, it => (it.address === address ? it.amount : 0))
    response.send({ balance })
  }

  getUnspentTransactionOutputsByAddress(request: Request, response: Response) {
    const address = request.params.address
    if (!validateAddress(address)) {
      return response.status(422).send({
        error: {
          code: 'INVALID_PATH_PARAMETERS',
          message: 'Invalid address',
        },
      })
    }

    const allTxInputsInPool = ApplicationStorage.TRANSACTION_POOL.flatMap(it => it.inputs)

    // prettier-ignore
    const unspentTxOutputs = ApplicationStorage.UNSPENT_TRANSACTION_OUTPUTS
      .filter(it => it.address === address)
      .filter(
        it => {
          const { outputId, outputIndex } = it // unspent transaction output
          const isIncluded = allTxInputsInPool.some(
            txInput => txInput.outputId === outputId && txInput.outputIndex === outputIndex,
          )
          return !isIncluded
        },
      )

    response.send(unspentTxOutputs)
  }

  getTransactionsByAddress(request: Request, response: Response) {
    const senderAddress = request.params.address
    if (!validateAddress(senderAddress)) {
      return response.status(422).send({
        error: {
          code: 'INVALID_PATH_PARAMETERS',
          message: 'Invalid address',
        },
      })
    }

    // prettier-ignore
    const confirmedTransactions = ApplicationStorage.BLOCKCHAIN
      .flatMap(block => block.data)
      .filter(tx => {
        const signature = tx.inputs[0].signature
        return signature ? verifySignature(tx.id, signature, senderAddress) : false
      })
      .map(tx => {
        const { id, outputs, timestamp } = tx
        const receiverAddress = outputs[0].address
        const amount = _.sumBy(outputs, txOutput => (txOutput.address === receiverAddress ? txOutput.amount : 0))
        return { id, senderAddress, receiverAddress, amount, timestamp, isConfirmed: true }
      })

    // prettier-ignore
    const unconfirmedTransactions = ApplicationStorage.TRANSACTION_POOL
      .filter(tx => {
        const signature = tx.inputs[0].signature
        return signature ? verifySignature(tx.id, signature, senderAddress) : false
      })
      .map(tx => {
        const { id, outputs, timestamp } = tx
        const receiverAddress = outputs[0].address
        const amount = _.sumBy(outputs, txOutput => (txOutput.address === receiverAddress ? txOutput.amount : 0))
        return { id, senderAddress, receiverAddress, amount, timestamp, isConfirmed: false }
      })

    // prettier-ignore
    response.send(
      confirmedTransactions
        .concat(unconfirmedTransactions)
        .sort((lhs, rhs) => lhs.timestamp >= rhs.timestamp ? 0 : 1) // descending timestamp
    )
  }
}
