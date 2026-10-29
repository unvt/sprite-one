import path from 'node:path'
import { Image } from '../../src/lib/image'

describe('test lib/image.ts', (): void => {
  const iconsDir = path.join(__dirname, '../icons')

  it('works', async () => {
    const image = new Image(path.join(iconsDir, 'airport.svg'), 1, 'airport')
    await image.parse()
    expect(image.buffer_height()).toStrictEqual(21)
    expect(image.buffer_width()).toStrictEqual(21)
  })

  it('works with sdf', async () => {
    const image = new Image(path.join(iconsDir, 'airport.svg'), 1, 'airport')
    await image.parse(true)
    expect(image.buffer_height()).toStrictEqual(21)
    expect(image.buffer_width()).toStrictEqual(21)
  })

  it('works with ratio', async () => {
    const image = new Image(path.join(iconsDir, 'airport.svg'), 2, 'airport')
    await image.parse()
    expect(image.buffer_height()).toStrictEqual(42)
    expect(image.buffer_width()).toStrictEqual(42)
  })

  it('works with ratio and sdf', async () => {
    const image = new Image(path.join(iconsDir, 'airport.svg'), 2, 'airport')
    await image.parse(true)
    expect(image.buffer_height()).toStrictEqual(54)
    expect(image.buffer_width()).toStrictEqual(54)
  })
})
