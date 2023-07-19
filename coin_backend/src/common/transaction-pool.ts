import _ from 'lodash'
import { ApplicationStorage } from '../global-storage'

export const getTransactionPool = () => _.cloneDeep(ApplicationStorage.TRANSACTION_POOL)
