import axios from 'axios'
import { buildApiUrl } from '../common'

export class WalletApiClient {
  static instance = new WalletApiClient()
  private constructor() {}

  async getBalanceByAddress(address: string) {
    const url = buildApiUrl(`/wallets/${address}/balance`)
    const resp = await axios.get<{ balance: number }>(url)
    return resp.data
  }
}
