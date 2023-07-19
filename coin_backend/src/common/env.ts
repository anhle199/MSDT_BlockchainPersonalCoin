import { safeParseJson } from './json'
import { isUndefined } from './type-validation'

type CastedTypeEnv = 'string' | 'number' | 'boolean' | 'arrayOfString' | 'arrayOfNumber' | 'arrayOfBoolean'
type Options = {
  throwErrorIfNotExists?: boolean
  defaultValue?: any
  castToType?: CastedTypeEnv
  delimiter?: string
}

export const getEnv = (
  key: string,
  options: Options = {
    throwErrorIfNotExists: true,
    defaultValue: undefined,
    castToType: 'string',
    delimiter: undefined,
  },
) => {
  // prettier-ignore
  const {
    throwErrorIfNotExists = true,
    defaultValue = undefined,
    castToType = 'string',
    delimiter = undefined
  } = options

  const value = process.env[key]

  if (throwErrorIfNotExists && isUndefined(value)) {
    throw new Error(`Env ${key} has not been defined yet.`)
  }

  if (isUndefined(value)) {
    return defaultValue
  }

  if (delimiter !== undefined) {
    const array = value.split(delimiter)
    switch (castToType) {
      case 'arrayOfNumber':
        return Array.isArray(array) ? array.map(it => Number(it)) : []
      case 'arrayOfBoolean':
        return Array.isArray(array) ? array.map(it => Boolean(it)) : []
      default:
        return array
    }
  } else {
    switch (castToType) {
      case 'string':
        return value
      case 'number':
        return Number(value)
      case 'string':
        return Boolean(value)
      case 'arrayOfString': {
        const array = safeParseJson(value)
        return Array.isArray(array) ? array : []
      }
      case 'arrayOfNumber': {
        const array = safeParseJson(value)
        return Array.isArray(array) ? array.map(it => Number(it)) : []
      }
      case 'arrayOfBoolean': {
        const array = safeParseJson(value)
        return Array.isArray(array) ? array.map(it => Boolean(it)) : []
      }
    }
  }
}
