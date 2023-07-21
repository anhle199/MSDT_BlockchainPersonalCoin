export type TKeyPairContent = {
  privateKey: string
  publicKey: string
}

export type TSidebarMenuItem = {
  id: number
  path: string
  name: string
  icon: string
  type: string
}

export type TAppEnvs = {
  API_URL: string
}

export type TUnspentTransactionOutput = {
  outputId: string
  outputIndex: number
  address: string
  amount: number
}

export type TTransactionInput = {
  outputId: string
  outputIndex: number
  signature: string
}

export type TTransactionOutput = {
  address: string
  amount: number
}

export type TTransaction = {
  id: string
  inputs: TTransactionInput[]
  outputs: TTransactionOutput[]
  timestamp: number
}

export type TSummarizeTransaction = {
  id: string
  senderAddress: string
  receiverAddress: string
  amount: number
  timestamp: number
  isConfirmed: boolean
}
