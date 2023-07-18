import { TApiSpec } from '../../types'

export abstract class BaseRestController {
  abstract apiSpecs: TApiSpec[]

  getApiSpecs() {
    return this.apiSpecs ?? {}
  }
}
