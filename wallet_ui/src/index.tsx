// import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { FullscreenLayout } from './components/layouts'
import { Sidebar } from './components/sidebar'
import { APPLICATION_PATHS, SIDEBAR_MENU_ITEMS } from './constants'
import { AccessWallet } from './pages/access-wallet'
import { CreateWallet } from './pages/create-wallet'
import { InternalError } from './pages/errors'
import { Home } from './pages/home'
import { SendTransaction, WalletPortfolio } from './pages/wallet'

import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const router = createBrowserRouter([
  {
    path: APPLICATION_PATHS.home,
    element: (
      <FullscreenLayout>
        <Home />
      </FullscreenLayout>
    ),
    errorElement: <InternalError />,
  },
  {
    path: APPLICATION_PATHS.createWallet,
    element: (
      <FullscreenLayout
        className="d-flex justify-content-center align-items-center"
        style={{ background: 'rgb(241, 250, 250)' }}
      >
        <CreateWallet />
      </FullscreenLayout>
    ),
    errorElement: <InternalError />,
  },
  {
    path: APPLICATION_PATHS.accessWallet,
    element: (
      <FullscreenLayout
        className="d-flex justify-content-center align-items-center"
        style={{ background: 'rgb(241, 250, 250)' }}
      >
        <AccessWallet />
      </FullscreenLayout>
    ),
    errorElement: <InternalError />,
  },
  {
    path: '/wallet',
    element: (
      <FullscreenLayout className="d-flex" style={{ background: 'rgb(241, 250, 250)' }}>
        <Sidebar menuItems={SIDEBAR_MENU_ITEMS}/>
        <Outlet />
      </FullscreenLayout>
    ),
    errorElement: <InternalError />,
    children: [
      {
        path: 'portfolio',
        element: <WalletPortfolio />,
        index: true,
      },
      {
        path: 'send',
        element: <SendTransaction />,
      },
      {
        path: 'history',
        element: <div>history</div>,
      },
    ],
  },
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  //   <StrictMode>
  <RouterProvider router={router} />,
  //   </StrictMode>,
)
