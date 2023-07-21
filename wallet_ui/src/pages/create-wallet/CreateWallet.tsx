import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'
import { Link } from 'react-router-dom'
import { exportFileFromData, generateKeyPair } from '../../common'
import { TKeyPairContent } from '../../types'
import { APPLICATION_PATHS } from '../../constants'

export function CreateWallet() {
  const [keyPair, setKeyPair] = useState<TKeyPairContent | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [readyToAccessWallet, setReadyToAccessWallet] = useState(false)

  const handleGenerateKeyPair = () => {
    const generatedKeyPair = generateKeyPair()
    setKeyPair(generatedKeyPair)
    setErrorMessage(null)
  }

  const handleDownloadFile = () => {
    if (keyPair) {
      try {
        const filename = `UTC--${new Date().toISOString()}--${keyPair.publicKey}`
        exportFileFromData(keyPair, filename)
        setErrorMessage(null)
        setReadyToAccessWallet(true)
      } catch (error) {
        setErrorMessage('There is an error while exporting or downloading the file. Please redownload the file.')
        setReadyToAccessWallet(false)
      }
    } else {
      setKeyPair(null)
      setReadyToAccessWallet(false)
      setErrorMessage("Keystore file don't generate yet. Please regenerate keystore file.")
    }
  }

  return (
    <Container className="shadow rounded-3 p-4" style={{ background: 'white', maxWidth: 600 }}>
      <Row className="text-center mb-4">
        <span className="h3 fw-bold">Create Wallet with Keystore File</span>
        <div>Please follow two below steps to create a wallet</div>
        <div>
          Already have a wallet? <Link to={APPLICATION_PATHS.accessWallet}>Access Wallet</Link>
        </div>
      </Row>

      <Stack gap={4}>
        <Card>
          <Card.Header>Step 1. Generate keystore file</Card.Header>
          <Card.Body>
            <Card.Text>
              This file contains sensitive information to access your wallet. Please generate and download to store
              safely.
            </Card.Text>
            <Stack direction="horizontal">
              <Button className="primary-green-button" onClick={handleGenerateKeyPair}>
                Generate
              </Button>
            </Stack>
          </Card.Body>
        </Card>
        <Card>
          <Card.Header>Step 2. Download and backup</Card.Header>
          <Card.Body>
            <Card.Text>
              This file can not recover so you instantly download and store privately before switching the next step.
            </Card.Text>
            <Button disabled={keyPair === null} onClick={handleDownloadFile}>
              Download
            </Button>
          </Card.Body>
        </Card>

        {errorMessage !== null && <div className="text-danger text-center">{errorMessage}</div>}
        {readyToAccessWallet && <Button href={APPLICATION_PATHS.accessWallet}>Access Wallet</Button>}
      </Stack>
    </Container>
  )
}
