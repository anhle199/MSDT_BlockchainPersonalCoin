import { ChangeEvent, FormEvent, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'
import { Link, useNavigate } from 'react-router-dom'
import { getPublicKeyFromPrivate, safeParseJson } from '../../common'
import { TKeyPairContent } from '../../types'
import { APPLICATION_PATHS } from '../../constants'

export function AccessWallet() {
  const navigate = useNavigate()
  const [keystoreFile, setKeystoreFile] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  const handleUploadFile = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ?? []
    setKeystoreFile(files[0] ?? null)
  }

  const handleVerfiyKeystoreFile = (event: FormEvent) => {
    event.preventDefault()
    setIsVerifying(true)

    if (keystoreFile) {
      const reader = new FileReader()
      reader.readAsText(keystoreFile)

      reader.onload = () => {
        const keyPair = safeParseJson<TKeyPairContent>(reader.result as any)
        if (keyPair && keyPair.publicKey === getPublicKeyFromPrivate(keyPair.privateKey)) {
          navigate(APPLICATION_PATHS.walletPortfolio)
        } else {
          setErrorMessage('The keystore file is invalid.')
        }
      }

      reader.onerror = () => {
        setErrorMessage('There is an error while validating keystore file.')
      }

      reader.onloadend = () => {
        setIsVerifying(false)
      }
    } else {
      setIsVerifying(false)
    }
  }

  return (
    <Container className="shadow rounded-3 p-4" style={{ background: 'white', maxWidth: 600 }}>
      <Row className="text-center mb-4">
        <span className="h3 fw-bold">Access my wallet</span>
        <div>
          <span>Don't have a wallet?</span> <Link to={APPLICATION_PATHS.createWallet}>Create Wallet</Link>{' '}
        </div>
      </Row>

      <Form onSubmit={handleVerfiyKeystoreFile}>
        <Form.Group controlId="formFile">
          <Form.Label>Select your Keystore File</Form.Label>
          <Stack direction="horizontal" gap={4}>
            <Form.Control type="file" onChange={handleUploadFile} />
            <Button type="submit" disabled={keystoreFile === null || isVerifying}>
              Verify
            </Button>
          </Stack>
        </Form.Group>
      </Form>

      {errorMessage && <div className="text-danger text-center pt-3">{errorMessage}</div>}
    </Container>
  )
}
