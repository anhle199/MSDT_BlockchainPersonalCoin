import cryptoWallet from './assets/crypto-wallet.png'
import eth from './assets/ethereum.png'
import { getEnv } from './common'
import { TAppEnvs, TSidebarMenuItem } from './types'

export const APPLICATION_PATHS = {
  home: '/',
  createWallet: '/create',
  accessWallet: '/access',
  walletPortfolio: '/wallet/portfolio',
  walletSendTransaction: '/wallet/send',
  walletTransactionHistory: '/wallet/history',
}

export const IMAGES = {
  cryptoWallet,
  cryptoLogo: eth,
}

export const SIDEBAR_MENU_ITEMS: TSidebarMenuItem[] = [
  {
    id: 0,
    path: '',
    name: '',
    icon: '',
    type: 'divider',
  },
  {
    id: 1,
    path: APPLICATION_PATHS.walletPortfolio,
    name: 'Portfolio',
    icon: 'graph-up-arrow',
    type: 'button',
  },
  {
    id: 2,
    path: APPLICATION_PATHS.walletSendTransaction,
    name: 'Send',
    icon: 'send',
    type: 'button',
  },
  {
    id: 3,
    path: APPLICATION_PATHS.walletTransactionHistory,
    name: 'Transaction History',
    icon: 'clock-history',
    type: 'button',
  },
  {
    id: 4,
    path: '',
    name: '',
    icon: '',
    type: 'divider',
  },
  {
    id: 5,
    path: APPLICATION_PATHS.accessWallet,
    name: 'Logout',
    icon: 'box-arrow-right',
    type: 'button',
  },
]

export const APPLICATION_ENVS: TAppEnvs = {
  API_URL: getEnv('REACT_APP_API_URL')
}
