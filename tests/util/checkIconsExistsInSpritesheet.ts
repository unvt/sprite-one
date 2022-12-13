import fs from 'node:fs'
import { SpriteImage } from '../../src/lib/interfaces'
import sharp from 'sharp'

export const checkIconsExistInSpritesheet = async (
  spriteJson: string,
  spriteSheet: string,
) => {
  const json: {
    [key: string]: SpriteImage
  } = JSON.parse(await fs.promises.readFile(spriteJson, 'utf-8'))
  for (const [_spriteId, spriteDef] of Object.entries(json)) {
    const spritePng2 = sharp(spriteSheet);
    const spriteBuf = await spritePng2.extract({
      left: spriteDef.x,
      top: spriteDef.y,
      width: spriteDef.width,
      height: spriteDef.height,
    }).toBuffer();
    expect(spriteBuf.length).toBeGreaterThan(100);
  }
}
