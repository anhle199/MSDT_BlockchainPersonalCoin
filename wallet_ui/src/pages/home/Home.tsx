import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { navigateToDefaultPage } from '../../common'

export function Home() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname === '/') {
      navigateToDefaultPage(navigate)
    }
  }, [])

  return (
    <>
      <Outlet />
    </>
  )
}
