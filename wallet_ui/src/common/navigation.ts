import { NavigateFunction } from 'react-router-dom'
import { APPLICATION_PATHS } from '../constants'

export const navigateToDefaultPage = (navigate: NavigateFunction) => {
  navigate(APPLICATION_PATHS.createWallet, { replace: true })
}
