import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv'
import { SCHEMA_TYPES } from '../constants'
import { BLOCK_SCHEMA } from '../models'

const ajv = new Ajv()

const cachedValidationFuncs: Record<SCHEMA_TYPES, ValidateFunction<any>> = {
  [SCHEMA_TYPES.BLOCK]: ajv.compile(BLOCK_SCHEMA)
}

export const validateAvailbleSchema = (data: any, schemaType: SCHEMA_TYPES): boolean => {
  const validate = cachedValidationFuncs[schemaType]
  return validate(data) ? true : false
}

export const validateSchema = <T>(data: any, schema: JSONSchemaType<T>): boolean => {
  const validate = ajv.compile(schema)
  return validate(data) ? true : false
}
