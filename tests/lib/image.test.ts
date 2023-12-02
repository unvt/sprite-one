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

  it('works with sdf', async () => {
    const image = new Image(path.join(iconsDir, 'airport.svg'), 1, 'airport')
    await image.parse(true)
    expect(image.real_height()).toStrictEqual(15)
    expect(image.real_width()).toStrictEqual(15)
  })

  it('works with ratio', async () => {
    const image = new Image(path.join(iconsDir, 'airport.svg'), 2, 'airport')
    await image.parse()
    expect(image.real_height()).toStrictEqual(30)
    expect(image.real_width()).toStrictEqual(30)
  })

  it('works with ratio and sdf', async () => {
    const image = new Image(path.join(iconsDir, 'airport.svg'), 2, 'airport')
    await image.parse(true)
    expect(image.real_height()).toStrictEqual(30)
    expect(image.real_width()).toStrictEqual(30)
  })
})
