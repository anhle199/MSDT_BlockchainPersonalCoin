import dotenv from 'dotenv'
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs'
import path from 'path'
import { generatePrivateKey, getEnv, getPublicKeyFromPrivate } from './common'

// temp
dotenv.config()

// absolute path
const privateKeyLocation = getEnv('PRIVATE_KEY_PATH', {
  throwErrorIfNotExists: false,
  defaultValue: path.resolve(__dirname, '../data/private_key.txt'),
})

export class Wallet {
  static instance = new Wallet()
  private constructor() {}

  getPrivateKey() {
    const buffer = readFileSync(privateKeyLocation, 'utf8')
    return buffer.toString()
  }

  getPublicKey() {
    const privateKey = this.getPrivateKey()
    return getPublicKeyFromPrivate(privateKey)
  }

  init = () => {
    if (!existsSync(privateKeyLocation)) {
      const newPrivateKey = generatePrivateKey()

      writeFileSync(privateKeyLocation, newPrivateKey)
      console.log(`New wallet with private key created to: ${privateKeyLocation}`)
    }
  }

  delete() {
    if (existsSync(privateKeyLocation)) {
      unlinkSync(privateKeyLocation)
    }
  }
}
