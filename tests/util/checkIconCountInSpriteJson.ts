import { SpriteImage } from '../../src/lib/interfaces'

export const checkIconCountInSpriteJson = async (
  output: string,
  iconCount: number
) => {
  const spriteJSON: {
    [key: string]: SpriteImage
  } = await require(output)
  expect(Object.keys(spriteJSON).length).toBe(iconCount)
}
