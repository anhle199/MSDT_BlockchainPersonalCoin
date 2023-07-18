import express, { Express } from 'express'
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
    if (!this.isStart) {
      const port = this.config.port
      this.server.listen(port, () => {
        console.log(`Rest server is running on port: ${port}`)
      })

      this.isStart = true
    }
  }

  private addController(controller: BaseRestController) {
    const apiSpecs = controller.getApiSpecs()

    for (const spec of apiSpecs) {
      switch (spec.httpMethod) {
        case 'GET':
          this.server.get(spec.path, spec.controllerMethod)
          break
        case 'POST':
          this.server.post(spec.path, spec.controllerMethod)
          break
        case 'PUT':
          this.server.put(spec.path, spec.controllerMethod)
          break
        case 'PATCH':
          this.server.patch(spec.path, spec.controllerMethod)
          break
        case 'DELETE':
          this.server.delete(spec.path, spec.controllerMethod)
          break
      }
    }
  }
}
