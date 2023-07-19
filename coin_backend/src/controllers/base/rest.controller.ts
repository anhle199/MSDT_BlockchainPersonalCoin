import { TApiSpec } from '../../types'

export abstract class BaseRestController {
  abstract apiSpecs: TApiSpec[]

  _getApiSpecs() {
    return this.apiSpecs ?? []
  }
}
