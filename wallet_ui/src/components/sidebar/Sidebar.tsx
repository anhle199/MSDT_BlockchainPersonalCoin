import { useState } from 'react'
import Image from 'react-bootstrap/Image'
import ListGroup from 'react-bootstrap/ListGroup'
import { useLocation, useNavigate } from 'react-router-dom'
import { APPLICATION_PATHS, IMAGES } from '../../constants'
import { TSidebarMenuItem } from '../../types'

export type TSidebarProps = {
  menuItems: TSidebarMenuItem[]
}

export function Sidebar(props: TSidebarProps) {
  const location = useLocation()
  const [selectedMenuItem, setSelectedMenuItem] = useState<TSidebarMenuItem | undefined>(props.menuItems[0])
  const navigate = useNavigate()

  const handleSelectMenuItem = (menuItem: TSidebarMenuItem) => {
    setSelectedMenuItem(menuItem)

    const privatePaths = [
      APPLICATION_PATHS.walletPortfolio,
      APPLICATION_PATHS.walletSendTransaction,
      APPLICATION_PATHS.walletTransactionHistory,
    ]
    const nextState = privatePaths.includes(menuItem.path) ? location.state : null
    navigate(menuItem.path, { state: nextState })
  }

  const handleGoHome = () => {
    navigate(APPLICATION_PATHS.createWallet, { replace: true })
  }

  return (
    <div className="d-flex flex-column shadow" style={{ minWidth: 250, maxWidth: 250, background: 'white' }}>
      <div className="d-flex align-items-center m-3">
        <Image className="me-2" src={IMAGES.cryptoWallet} style={{ width: 40, height: 40 }} />
        <div className="fs-3 fw-bold">HA Wallet</div>
      </div>

      <ListGroup className="mx-3" variant="flush">
        {props.menuItems.map(item =>
          item.type === 'button' ? (
            <ListGroup.Item
              className="text-start rounded border-0"
              key={item.id}
              active={item.id === selectedMenuItem?.id}
              onClick={() => handleSelectMenuItem(item)}
              as="button"
            >
              <i className={`bi bi-${item.icon} p-2`} />
              {item.name}
            </ListGroup.Item>
          ) : (
            <hr key={item.id} />
          ),
        )}
      </ListGroup>
    </div>
  )
}
