import express, { Express } from 'express'
import { HTTP_METHODS } from '../constants'
import { BaseRestController } from '../controllers'
import { sequenceMiddleware } from '../middlewares'
import { TRestServerConfig } from '../types'

export class RestServer {
  protected server: Express

  // states
  private isSetup = false
  private isStart = false

  constructor(protected config: TRestServerConfig) {
    this.server = express()
  }

  setup() {
    if (!this.isSetup) {
      this.server.use(express.json())
      this.server.use(express.urlencoded({ extended: true }))

      // sequence
      this.server.use(sequenceMiddleware)

      // controllers
      const controllers = this.config.controllers ?? []
      for (const controller of controllers) {
        this.addController(controller)
      }

      this.isSetup = true
    }
  }

  start() {
    if (!this.isSetup) {
      throw Error('The rest server must be configured before starting, call setup() method to configure')
    }

    if (!this.isStart) {
      const port = this.config.port
      this.server.listen(port, () => {
        console.log(`Rest server is running on port: ${port}`)
      })

      this.isStart = true
    }
  }

  private addController(controller: BaseRestController) {
    const apiSpecs = controller._getApiSpecs()

    for (const spec of apiSpecs) {
      switch (spec.httpMethod) {
        case HTTP_METHODS.GET:
          this.server.get(spec.path, spec.controllerMethod.bind(controller))
          break
        case HTTP_METHODS.POST:
          this.server.post(spec.path, spec.controllerMethod.bind(controller))
          break
        case HTTP_METHODS.PUT:
          this.server.put(spec.path, spec.controllerMethod.bind(controller))
          break
        case HTTP_METHODS.PATCH:
          this.server.patch(spec.path, spec.controllerMethod.bind(controller))
          break
        case HTTP_METHODS.DELETE:
          this.server.delete(spec.path, spec.controllerMethod.bind(controller))
          break
      }
    }
  }
}
