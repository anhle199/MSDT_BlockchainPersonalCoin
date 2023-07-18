import { Request, Response } from 'express'
import { AppConstants } from '../constants'
import { BlockService } from '../services'
import { TApiSpec } from '../types'
import { BaseRestController } from './base'
import { getLatestBlock } from '../common'

export class BlockController extends BaseRestController {
  apiSpecs: TApiSpec[]
  service: BlockService

  constructor() {
    super()

    this.service = new BlockService()
    this.apiSpecs = [
      {
        httpMethod: 'GET',
        path: '/blocks',
        controllerMethod: this.getAllBlocks.bind(this),
      },
      {
        httpMethod: 'POST',
        path: '/blocks',
        controllerMethod: this.mineBlock.bind(this),
      },
    ]
  }

  getAllBlocks(request: Request, response: Response) {
    response.send(AppConstants.BLOCKCHAIN)
  }

  mineBlock(request: Request, response: Response) {
    const newBlock = this.service.generateNewBlock(request.body.data, getLatestBlock())
    if (this.service.addBlockToChain(newBlock)) {
      response.send(newBlock)
    } else {
      throw Error('Failed to add new block')
    }
  }
}
