import { NextFunction, Request, Response } from 'express'
import _ from 'lodash'

export const sequenceMiddleware = (request: Request, response: Response, next: NextFunction) => {
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
}
