import { useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Container, ListGroup, OverlayTrigger, Row, Stack, Tooltip } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { WalletApiClient } from '../../../apis'
import { APPLICATION_PATHS } from '../../../constants'
import { TSummarizeTransaction } from '../../../types'

const truncateText = (text: string, ratio: number = 1) => text.substring(0, ratio * 20) + '...'

export function TransactionHistory() {
  const location = useLocation()
  const navigate = useNavigate()
  const [data, setData] = useState<TSummarizeTransaction[]>([])

  useEffect(() => {
    //console.log(location.state)
    if (location.state) {
      WalletApiClient.instance
        .getSummarizeTransactions(location.state.publicKey)
        .then(resp => {
          setData(resp)
        })
        .catch(error => {
          setData([])
          //console.log(error)
        })
    } else {
      navigate(APPLICATION_PATHS.createWallet, { replace: true })
    }
  }, [])

  return (
    <Container className="mx-2 my-3">
      <Row>
        <Col sm="12">
          <Card>
            <Card.Header>Transaction History</Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {data.map((item, index) => (
                  <ListGroup.Item key={index} className="px-0 py-3">
                    <Row>
                      <Col className="text-start">
                        <div className="d-flex flex-row align-items-center">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-disabled">{item.isConfirmed ? 'Confirmed' : 'Unconfirmed'}</Tooltip>
                            }
                          >
                            <span className="d-inline-block">
                              <Button
                                variant={item.isConfirmed ? 'success' : 'warning'}
                                disabled
                                className="opacity-100 me-2"
                                style={{ pointerEvents: 'none' }}
                              >
                                <i className={`bi bi-${item.isConfirmed ? 'check-square' : 'hourglass'}`} />
                              </Button>
                            </span>
                          </OverlayTrigger>

                          <div className="d-flex flex-column">
                            <Link className="text-decoration-none" to="">
                              {truncateText(item.id)}
                            </Link>
                            <span>{item.timestamp}</span>
                          </div>
                        </div>
                      </Col>

                      <Col className="d-flex flex-column">
                        <Stack direction="horizontal" gap={2}>
                          <span>From</span>
                          <Link className="text-decoration-none" to="">
                            {truncateText(item.senderAddress, 2)}
                          </Link>
                        </Stack>

                        <Stack direction="horizontal" gap={2}>
                          <span>To</span>
                          <Link className="text-decoration-none" to="">
                            {truncateText(item.receiverAddress, 2)}
                          </Link>
                        </Stack>
                      </Col>

                      <Col className="text-end">
                        <OverlayTrigger overlay={<Tooltip id="tooltip">Amount</Tooltip>}>
                          <Badge
                            bg="secondary"
                            className="p-2 border border-white"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            data-bs-title="Amount"
                          >
                            {item.amount} coin(s)
                          </Badge>
                        </OverlayTrigger>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
