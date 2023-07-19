import { ec as EC } from 'elliptic'
import { BinaryToTextEncoding, createHash } from 'node:crypto'
import { toHexString } from './base-number'

const ec = new EC('secp256k1')

export const sha256 = (data: string, encoding: BinaryToTextEncoding = 'hex') => {
  return createHash('sha256').update(data).digest(encoding)
}

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
