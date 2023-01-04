import path from 'node:path'
import fs from 'node:fs'
import crypto from 'node:crypto'
// import { SpriteImage } from '../../src/lib/interfaces'

const _md5hash = async (filePath: string) => {
  const fileBuf = await fs.promises.readFile(filePath)
  const hash = crypto.createHash('md5')
  hash.update(fileBuf)
  return hash.digest('hex')
}

export const checkFileMatchesFixture = async (filePath: string) => {
  const basename = path.basename(filePath)
  const fixturePath = path.join(__dirname, '..', 'fixtures', basename)
  const [fileHash, fixtureHash] = await Promise.all(
    [filePath, fixturePath].map((x) => _md5hash(x)),
  )
  expect(fileHash).toStrictEqual(fixtureHash)
}
