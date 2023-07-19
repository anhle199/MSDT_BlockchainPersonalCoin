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
