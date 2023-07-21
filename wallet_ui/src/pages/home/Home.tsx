import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button'

type TAppProps = {}

export function Home(props: TAppProps) {
  return (
    <Stack>
      <Button href={'/wallet/create'}>Create Wallet</Button>
      <Button href={'/wallet/access'}>Access Wallet</Button>
    </Stack>
  )
}
