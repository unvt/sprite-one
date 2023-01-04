import path from 'node:path'

import { Image } from '../../src/lib/image'
import { Matrix } from '../../src/lib/matrix'

const iconsDir = path.join(__dirname, '../icons')
// const icons2Dir = path.join(__dirname, '../icons2')
// const images2 = [
//   new Image(path.join(icons2Dir, 'arrow.svg'), 2, 'arrow'),
//   new Image(path.join(icons2Dir, 'circle.svg'), 2, 'circle'),
// ]

describe('test lib/matrix.ts', (): void => {
  test('matrix calculation works with 1 image', async () => {
    const images1 = [
      await new Image(path.join(iconsDir, 'airport.svg'), 1, 'airport').parse(),
      // await new Image(path.join(iconsDir, 'airport2.svg'), 1, 'airport').parse(),
    ]

    expect(images1[0].height).toStrictEqual(15)
    expect(images1[0].width).toStrictEqual(15)

    const matrix = new Matrix(images1)
    matrix.calc()

    expect(matrix.max_x).toStrictEqual(15)
    expect(matrix.max_y).toStrictEqual(15)
  })

  test('matrix calculation works with 2 images', async () => {
    const images1 = [
      await new Image(path.join(iconsDir, 'airport.svg'), 1, 'airport').parse(),
      await new Image(
        path.join(iconsDir, 'airport.svg'),
        1,
        'airport2',
      ).parse(),
    ]

    const matrix = new Matrix(images1)
    matrix.calc()

    expect(matrix.max_x).toStrictEqual(30)
    expect(matrix.max_y).toStrictEqual(15)
  })
})
