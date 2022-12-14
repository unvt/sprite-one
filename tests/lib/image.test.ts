import path from 'node:path'
import { Image } from '../../src/lib/image'

describe('test lib/image.ts', (): void => {
  const iconsDir = path.join(__dirname, '../icons')

  it('works', async () => {
    const image = new Image(path.join(iconsDir, 'airport.svg'), 1, 'airport')
    await image.parse()
    expect(image.real_height()).toStrictEqual(15)
    expect(image.real_width()).toStrictEqual(15)
  })
})
