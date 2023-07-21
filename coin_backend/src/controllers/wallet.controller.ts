import { Request, Response } from 'express'
import _ from 'lodash'
import { validateAddress } from '../common'
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
}
