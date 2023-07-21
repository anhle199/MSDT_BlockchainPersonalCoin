import { ec as EC } from 'elliptic'
import { toHexString } from './base-number'

const ec = new EC('secp256k1')

export const sign = (data: string, privateKey: string) => {
  const key = ec.keyFromPrivate(privateKey, 'hex')
  return toHexString(key.sign(data).toDER())
}

export const verifySignature = (data: string, signature: string, publicKey: string) => {
  const key = ec.keyFromPublic(publicKey, 'hex')
  return key.verify(data, signature)
}

export const getPublicKeyFromPrivate = (privateKey: string) => {
  return ec.keyFromPrivate(privateKey, 'hex').getPublic().encode('hex', false)
}

export const generatePrivateKey = () => {
  const keyPair = ec.genKeyPair()
  return keyPair.getPrivate().toString(16)
}

export const generateKeyPair = () => {
  const keyPair = ec.genKeyPair()
  const privateKey = keyPair.getPrivate().toString(16)
  const publicKey = keyPair.getPublic().encode('hex', false)
  return { privateKey, publicKey }
}
