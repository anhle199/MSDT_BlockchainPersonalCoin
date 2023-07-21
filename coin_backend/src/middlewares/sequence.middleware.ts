import { NextFunction, Request, Response } from 'express'
import _ from 'lodash'

let REQUEST_COUNT = 0

export const sequenceMiddleware = (request: Request, response: Response, next: NextFunction) => {
  const startTime = process.hrtime()

  REQUEST_COUNT += 1
  const requestId = REQUEST_COUNT

  const method = request.method.toUpperCase()
  const url = request.url
  //const version = request.httpVersion
  const statusCode = response.statusCode
  const endTime = process.hrtime(startTime)
  const processTimeInMs = (endTime[0] * 1000000000 + endTime[1]) / 1000000

  // prettier-ignore
  console.log(`[${new Date().toISOString()}] [REQUEST-${requestId}] - ${method} ${url}`)
  // prettier-ignore
  console.log(`[${new Date().toISOString()}] [REQUEST-${requestId}] - PARAMS ${JSON.stringify(request.params)}`)
  // prettier-ignore
  console.log(`[${new Date().toISOString()}] [REQUEST-${requestId}] - BODY ${JSON.stringify(request.body)}`)

  try {
    // handle upstream invoking controller method
    next()
    // handle downstream invoking controller method
  } catch (error) {
    const errorCode = _.get(error, 'statusCode', 500)
    const internalCode = _.get(error, 'internalCode', 0)
    const message = _.get(error, 'message', 'Internal Server Error')
    const details = _.get(error, 'details', [])

    response.status(errorCode).send({
      error: {
        code: internalCode,
        message,
        details,
      },
    })
  }

  // prettier-ignore
  console.log(`[${new Date().toISOString()}] [RESPONSE-${requestId}] - ${statusCode} ${processTimeInMs.toFixed(3)}ms`)
}
