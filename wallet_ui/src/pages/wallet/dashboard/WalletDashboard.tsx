import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { navigateToDefaultPage } from '../../../common'

export function WalletDashboard() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname === '/wallet' || location.pathname === '/wallet/') {
      navigateToDefaultPage(navigate)
    }
  }, [])

  return (
    <>
      <Outlet />
    </>
  )
}
