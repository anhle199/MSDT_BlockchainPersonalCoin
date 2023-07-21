import axios from 'axios'
import { buildApiUrl } from '../common'
import { TSummarizeTransaction, TUnspentTransactionOutput } from '../types'

export class WalletApiClient {
  static instance = new WalletApiClient()
  private constructor() {}

  async getBalanceByAddress(address: string) {
    const url = buildApiUrl(`/wallets/${address}/balance`)
    const resp = await axios.get<{ balance: number }>(url)
    return resp.data
  }

  async getAllUnspentTransactionOutputs(address: string) {
    const url = buildApiUrl(`/wallets/${address}/unspentTransactionOutputs`)
    const resp = await axios.get<TUnspentTransactionOutput[]>(url)
    return resp.data
  }

  async getSummarizeTransactions(address: string) {
    const url = buildApiUrl(`/wallets/${address}/transactions`)
    const resp = await axios.get<TSummarizeTransaction[]>(url)
    return resp.data
  }
}
