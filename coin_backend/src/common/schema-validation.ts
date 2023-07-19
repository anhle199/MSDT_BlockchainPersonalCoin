import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv'
import { SCHEMA_TYPES } from '../constants'
import {
  BLOCK_SCHEMA,
  TRANSACTION_INPUT_SCHEMA,
  TRANSACTION_OUTPUT_SCHEMA,
  TRANSACTION_SCHEMA,
  UNSPENT_TRANSACTION_OUTPUT_SCHEMA,
} from '../models'

const ajv = new Ajv()

const cachedValidationFuncs: Record<SCHEMA_TYPES, ValidateFunction<any>> = {
  [SCHEMA_TYPES.BLOCK]: ajv.compile(BLOCK_SCHEMA),
  //[SCHEMA_TYPES.UNSPENT_TRANSACTION_OUTPUT]: ajv.compile(UNSPENT_TRANSACTION_OUTPUT_SCHEMA),
  //[SCHEMA_TYPES.TRANSACTION_INPUT]: ajv.compile(TRANSACTION_INPUT_SCHEMA),
  //[SCHEMA_TYPES.TRANSACTION_OUTPUT]: ajv.compile(TRANSACTION_OUTPUT_SCHEMA),
  [SCHEMA_TYPES.TRANSACTION]: ajv.compile(TRANSACTION_SCHEMA),
}

export const validateAvailbleSchema = (data: any, schemaType: SCHEMA_TYPES): boolean => {
  const validate = cachedValidationFuncs[schemaType]
  return validate(data) ? true : false
}

export const validateSchema = (data: any, schema: JSONSchemaType<any>): boolean => {
  const validate = ajv.compile(schema)
  return validate(data) ? true : false
}
