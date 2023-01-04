import fs from 'node:fs'
import { SpriteImage } from '../../src/lib/interfaces'

export const checkIconCountInSpriteJson = async (
  output: string,
  iconCount: number,
) => {
  const spriteJSON: {
    [key: string]: SpriteImage
  } = JSON.parse(await fs.promises.readFile(output, 'utf-8'))
  expect(Object.keys(spriteJSON).length).toBe(iconCount)
}
