import { FormEvent, useEffect } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import { TKeyPairContent } from '../../../types'

const keyPair: TKeyPairContent = {
  privateKey: '35261aca5fded8c854ca0ef087c55723281d8d27b9395653446ac54d94866cf3',
  publicKey:
    '04547bcec1752285ccda0bedb962afdb5eb64f1bd82fec6d8ef06310cedb13262a0164abc08e98910221d7da44a970a1fa5c3f3c5a16855a99106cf6b85e16ce69',
}

export function SendTransaction() {
  const handleSendTransaction = (event: FormEvent) => {
    event.preventDefault()
  }

  return (
    <Card className="m-4 w-100">
      <Card.Header>Send</Card.Header>
      <Card.Body>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextBalance">
          <Form.Label column sm="2">
            Balance
          </Form.Label>
          <Col sm="10">
            <Form.Control plaintext readOnly value={'1000 Coins'} />
          </Col>
        </Form.Group>

        <hr />

        <Form onSubmit={handleSendTransaction}>
          <Form.Group as={Row} className="mb-3" controlId="formAmount">
            <Form.Label column sm={2}>
              Amount
            </Form.Label>
            <Col sm={10}>
              <Form.Control type="number" defaultValue={0} min={0} />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formAddress">
            <Form.Label column sm={2}>
              To Address
            </Form.Label>
            <Col sm={10}>
              <Form.Control type="text" placeholder="Receiver address" />
            </Col>
          </Form.Group>

          <Button variant="primary" type="submit">
            Confirm and send
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}
