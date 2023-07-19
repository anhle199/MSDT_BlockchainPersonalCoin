import { Request, Response } from 'express'
import { getLatestBlock } from '../common'
import { HTTP_METHODS } from '../constants'
import { ApplicationStorage } from '../global-storage'
import { BlockService } from '../services'
import { TApiSpec } from '../types'
import { BaseRestController } from './base'

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
    ]
  }

  getAllBlocks(request: Request, response: Response) {
    response.send(ApplicationStorage.BLOCKCHAIN)
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
