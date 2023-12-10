import path from 'node:path'
import fs from 'node:fs'
import crypto from 'node:crypto'

const _toJsonObject = async (filePath: string) => {
  const fileBuf = await fs.promises.readFile(filePath)
  return JSON.parse(fileBuf.toString())
}

export const checkJSONFileMatchesFixture = async (filePath: string) => {
  const basename = path.basename(filePath)
  const fixturePath = path.join(__dirname, '..', 'fixtures', basename)
  const [fileJSON, fixtureJSON] = await Promise.all(
    [filePath, fixturePath].map((x) => _toJsonObject(x)),
  )
  expect(fileJSON).toEqual(fixtureJSON)
}
