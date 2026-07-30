import path from 'node:path'
import sharp from 'sharp'

const _rawPixels = async (filePath: string) => {
  const { data, info } = await sharp(filePath)
    .raw()
    .toBuffer({ resolveWithObject: true })
  return { data, info }
}

export const checkFileMatchesFixture = async (filePath: string) => {
  const basename = path.basename(filePath)
  const fixturePath = path.join(__dirname, '..', 'fixtures', basename)
  const [file, fixture] = await Promise.all(
    [filePath, fixturePath].map((x) => _rawPixels(x)),
  )

  // Compare decoded pixels rather than encoded bytes so that changes in the
  // PNG encoder (e.g. a bundled libvips/zlib update in sharp) do not break the
  // test as long as the resulting image is pixel-identical.
  expect({
    width: file.info.width,
    height: file.info.height,
    channels: file.info.channels,
  }).toStrictEqual({
    width: fixture.info.width,
    height: fixture.info.height,
    channels: fixture.info.channels,
  })
  expect(file.data.equals(fixture.data)).toBe(true)
}
