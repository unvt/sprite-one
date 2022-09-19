import { SpriteImage } from '../../src/lib/interfaces'

export const checkRatioInSpriteJson = async (output: string, ratio: number) => {
  const spriteJSON: {
    [key: string]: SpriteImage
  } = await require(output)
  Object.keys(spriteJSON).forEach((key) => {
    const json = spriteJSON[key]
    expect(json.pixelRatio).toBe(ratio)
  })
}
