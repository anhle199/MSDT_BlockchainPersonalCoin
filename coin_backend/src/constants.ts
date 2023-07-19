export enum HTTP_METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum EVENT_TYPES {
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  ALL = 'ALL',
}

export enum SOCKET_MESSAGE_TYPES {
  QUERY_LATEST_BLOCK,
  QUERY_CHAIN,
  RESPONSE_CHAIN,
}

export enum BLOCKCHAIN_MESSAGE_TYPES {
  QUERY_CHAIN,
  RESPONSE_CHAIN,
  QUERY_LATEST_BLOCK,
  RESPONSE_LATEST_BLOCK,
}

// in seconds
export const BLOCK_GENERATION_INTERVAL = 10
// in blocks
export const DIFFICULTY_ADJUSTMENT_INTERVAL = 10
// in seconds
export const SECURITY_BLOCK_TIMESTAMP = 60

export enum SCHEMA_TYPES {
  BLOCK = 'block',
  //UNSPENT_TRANSACTION_OUTPUT = 'unspent-transaction-output',
  //TRANSACTION_INPUT = 'transaction-input',
  //TRANSACTION_OUTPUT = 'transaction-output',
  TRANSACTION = 'transaction',
}

export const COINBASE_AMOUNT = 50
