import { BinaryToTextEncoding, createHash } from 'node:crypto'

export const sha256 = (data: string, encoding: BinaryToTextEncoding = 'hex') => {
  return createHash('sha256').update(data).digest(encoding)
}
