import { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { WalletApiClient } from '../../../apis'
import { APPLICATION_PATHS } from '../../../constants'
import { TKeyPairContent } from '../../../types'

export function WalletPortfolio() {
  const location = useLocation()
  const navigate = useNavigate()
  const [keyPair, setKeyPair] = useState<TKeyPairContent | null>(null)
  const [balance, setBalance] = useState<number>(0)
  //const [latestBlockNumber, setLatestBlockNumber] = useState<number>(0)

  useEffect(() => {
    if (location.state) {
      setKeyPair(location.state)

      WalletApiClient.instance
        .getBalanceByAddress(location.state.publicKey)
        .then(resp => {
          setBalance(resp.balance)
        })
        .catch(error => {
          setBalance(0)
          //console.log(error)
        })
    } else {
      navigate(APPLICATION_PATHS.createWallet, { replace: true })
    }
  }, [])

  const reloadBalance = async () => {
    if (!keyPair) {
      navigate(APPLICATION_PATHS.createWallet, { replace: true })
    }

    try {
      const { balance } = await WalletApiClient.instance.getBalanceByAddress(location.state.publicKey)
      setBalance(balance)
    } catch (error) {
      setBalance(0)
      //console.log(error)
    }
  }

  return (
    <Container className="mx-2 my-3">
      <Row>
        <Col sm="12">
          <Card>
            <Card.Header>Wallet Information</Card.Header>
            <Card.Body>
              <Form.Group as={Row} className="mb-3" controlId="formBalance">
                <Form.Label column sm="2">
                  Balance (coins)
                </Form.Label>
                <Col sm="10" className="d-flex flex-row">
                  <Form.Control type="text" value={balance} readOnly />
                  <Button className="ms-3" onClick={reloadBalance}>
                    <i className="bi bi-arrow-clockwise" />
                  </Button>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="formAddress">
                <Form.Label column sm="2">
                  Address
                </Form.Label>
                <Col sm="10" className="d-flex flex-row">
                  <Form.Control type="text" value={keyPair?.publicKey} readOnly />
                  <Button className="ms-3">
                    <i className="bi bi-clipboard2-fill" />
                  </Button>
                </Col>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        {/*<Col sm="3">
          <Card>
            <Card.Header>Network</Card.Header>
            <div className="d-flex align-items-center m-2 p-1 bg-body-secondary rounded">
              <Card.Body className="p-2">
                <Card.Title>Testnet</Card.Title>
                <Card.Text>Latest block: {500}</Card.Text>
              </Card.Body>
              <Image className="me-2" src={IMAGES.cryptoLogo} style={{ width: 60, height: 60 }} />
            </div>
          </Card>
      </Col>*/}
      </Row>
    </Container>
  )
}
