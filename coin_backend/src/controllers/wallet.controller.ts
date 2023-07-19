import { Request, Response } from 'express'
import _ from 'lodash'
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
        path: '/wallet/address',
        controllerMethod: this.getAccountAddress,
      },
      {
        httpMethod: HTTP_METHODS.GET,
        path: '/wallet/balance',
        controllerMethod: this.getAccountBalance,
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
}
