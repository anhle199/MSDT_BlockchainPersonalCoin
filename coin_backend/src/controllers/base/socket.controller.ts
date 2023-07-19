import { TSocketEventSpec } from '../../types'

export abstract class BaseSocketController {
  abstract eventSpecs: TSocketEventSpec[]

  _getEventSpecs() {
    return this.eventSpecs ?? []
  }
}
