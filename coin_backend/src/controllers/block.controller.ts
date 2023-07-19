import { Request, Response } from 'express'
import { isString } from '../common'
import { HTTP_METHODS } from '../constants'
import { ApplicationStorage } from '../global-storage'
import { BlockService } from '../services'
import { TApiSpec } from '../types'
import { BaseRestController } from './base'
import { Wallet } from '../wallet'

export class BlockController extends BaseRestController {
  apiSpecs: TApiSpec[]
  service: BlockService

  constructor() {
    super()

    this.service = new BlockService()
    this.apiSpecs = [
      {
        httpMethod: HTTP_METHODS.GET,
        path: '/blocks',
        controllerMethod: this.getAllBlocks,
      },
      {
        httpMethod: HTTP_METHODS.POST,
        path: '/blocks',
        controllerMethod: this.mineBlock,
      },
      {
        httpMethod: HTTP_METHODS.GET,
        path: '/blocks/:hash',
        controllerMethod: this.getBlockByHash,
      },
    ]
  }

  getAllBlocks(request: Request, response: Response) {
    response.send(ApplicationStorage.BLOCKCHAIN)
  }

  mineBlock(request: Request, response: Response) {
    const address = Wallet.instance.getPublicKey()
    const nextBlock = this.service.generateNextBlock(address)
    if (nextBlock) {
      response.send(nextBlock)
    } else {
      throw Error('Failed to add new block')
    }
  }

  getBlockByHash(request: Request, response: Response) {
    const hash = request.params.hash

    if (!isString(hash)) {
      return response.status(422).send({
        error: {
          code: 'INVALID_QUERY_PARAMETERS',
          message: 'Invalid block hash',
        },
      })
    }

    const block = ApplicationStorage.BLOCKCHAIN.find(block => block.hash === hash)
    if (!block) {
      return response.status(404).send({
        error: {
          code: 'BLOCK_NOT_FOUND',
          message: 'Block not found',
        },
      })
    }

    response.send(block)
  }
}
