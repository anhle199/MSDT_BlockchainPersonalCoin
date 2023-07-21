import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { TransactionApiClient, WalletApiClient } from '../../../apis'
import { createTransaction, navigateToDefaultPage } from '../../../common'
import { TKeyPairContent } from '../../../types'

const schema = z.object({
  amount: z.number().positive({ message: 'Amount must be greater than zero' }),
  address: z
    .string()
    .trim()
    .length(130, { message: 'Invalid receiver address' })
    .regex(/^04[a-fA-F0-9]+$/, { message: 'Invalid receiver address' }),
})

type TFormInputs = {
  amount: number
  address: string
}

export function SendTransaction() {
  const location = useLocation()
  const navigate = useNavigate()
  const [keyPair, setKeyPair] = useState<TKeyPairContent | null>(null)
  const [balance, setBalance] = useState<number>(0)
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFormInputs>({
    resolver: zodResolver(schema),
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

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
      navigateToDefaultPage(navigate)
    }
  }, [])

  const reloadBalance = async () => {
    if (!keyPair) {
      navigateToDefaultPage(navigate)
    }

    try {
      const { balance } = await WalletApiClient.instance.getBalanceByAddress(location.state.publicKey)
      setBalance(balance)
    } catch (error) {
      setBalance(0)
      //console.log(error)
    }
  }

  const handleSendTransaction: SubmitHandler<TFormInputs> = async formValues => {
    setIsSubmitting(true)

    if (keyPair) {
      const { amount, address } = formValues
      try {
        const unspentTxOutputs = await WalletApiClient.instance.getAllUnspentTransactionOutputs(keyPair.publicKey)
        const transaction = createTransaction(address, amount, keyPair.privateKey, keyPair.publicKey, unspentTxOutputs)
        if (!transaction) {
          alert(`There is an error while sending ${amount} coin(s) to address ${address}`)
        } else {
          await TransactionApiClient.instance.sendSignedTransaction(transaction)
          alert(`You have sent ${amount} coin(s) to address ${address} successfully`)
          reset()
        }
      } catch (error) {
        alert(`There is an error while sending ${amount} coin(s) to address ${address}`)
      }

      setIsSubmitting(false)
    } else {
      setIsSubmitting(false)
      navigateToDefaultPage(navigate)
    }
  }

  return (
    <Card className="m-4 w-100">
      <Card.Header>Send</Card.Header>
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

        <hr />

        <Form onSubmit={handleSubmit(handleSendTransaction)}>
          <Form.Group as={Row} className="mb-3" controlId="formAmount">
            <Form.Label column sm={2}>
              Amount
            </Form.Label>

            <Col sm={10}>
              <Controller
                control={control}
                name="amount"
                defaultValue={0}
                render={({ field: { ref, value, onChange } }) => (
                  <Form.Control
                    ref={ref}
                    value={value}
                    disabled={isSubmitting}
                    onChange={event => onChange(Number(event.target.value))}
                    type="number"
                    min={0}
                    max={balance}
                  />
                )}
              />
            </Col>

            <Form.Text className="text-danger">{errors?.amount?.message}</Form.Text>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formAddress">
            <Form.Label column sm={2}>
              To Address
            </Form.Label>

            <Col sm={10}>
              <Controller
                control={control}
                name="address"
                defaultValue=""
                render={({ field: { ref, value, onChange } }) => (
                  <Form.Control
                    ref={ref}
                    value={value}
                    disabled={isSubmitting}
                    onChange={onChange}
                    type="text"
                    placeholder="Receiver address"
                  />
                )}
              />
            </Col>

            <Form.Text className="text-danger">{errors?.address?.message}</Form.Text>
          </Form.Group>

          <Button variant="primary" type="submit">
            Confirm and send
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}
