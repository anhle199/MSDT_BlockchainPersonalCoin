import axios from 'axios'
import { buildApiUrl } from '../common'
import { TTransaction } from '../types'

export class TransactionApiClient {
  static instance = new TransactionApiClient()
  private constructor() {}

  async sendSignedTransaction(transaction: TTransaction) {
    const url = buildApiUrl(`/transactions/sendSigned`)
    const resp = await axios.post<{ balance: number }>(url, transaction)
    return resp.data
  }
}
