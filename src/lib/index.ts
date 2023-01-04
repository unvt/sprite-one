import path from 'path'
import * as fs from 'fs'
import { Image } from './image'
import { Matrix } from './matrix'
import sharp from 'sharp'
import { SpriteImage } from './interfaces'

const generate = async (
  output_file_name: string,
  input_directories: string[],
  ratio: number,
  defaultSpriteName = false
) => {
  let spriteName = ''
  if (defaultSpriteName === true) {
    if (ratio > 1) {
      spriteName = `@${ratio}x`
    }
  }
  const output_json = `${output_file_name}${spriteName}.json`
  const output_png = `${output_file_name}${spriteName}.png`
  // Get file list
  let images: Image[] = []
  for (const input_directory of input_directories) {
    const files = await fs.promises.readdir(input_directory)

    // If there are multiple icons with the same name but with different pixel ratios
    // (such as icon.png, icon@2x.png), we will group them together and use the appropriate
    // file without scaling. If multiple icons do not exist, we will use the single icon
    // and scale as necessary (for example, when the icon is SVG)

    const dir_file_sets: {
      [key: string]: { file_ratio: number; file: string }[]
    } = {}
    for (const file of files) {
      const extname = path.extname(file) // .svg, .png
      if (extname !== '.svg' && extname !== '.png') {
        // we only support SVG and PNG files right now.
        continue
      }
      const basename = path.basename(file, extname) // icon, icon@2x
      const icon_name = basename.replace(/@\d+x$/, '') // icon, icon
      const ratio_match = basename.match(/@(\d+)x$/)
      const file_ratio = ratio_match ? parseInt(ratio_match[1], 10) : 1
      const icon_filenames = dir_file_sets[icon_name] || []
      dir_file_sets[icon_name] = [...icon_filenames, { file_ratio, file }]
    }

    for (const [icon_name, file_set] of Object.entries(dir_file_sets)) {
      const file_at_ratio =
        file_set.find((x) => x.file_ratio === ratio) ||
        file_set.find((x) => x.file_ratio === 1)
      if (!file_at_ratio) continue

      const source_file = path.join(input_directory, file_at_ratio.file)
      const image = new Image(
        source_file,
        ratio,
        icon_name,
        file_at_ratio.file_ratio
      )
      images.push(image)
    }
  }

  return Promise.all(images.map((image) => image.parse())).then(
    async (images) => {
      images.sort((a, b) => a.range - b.range)
      const matrix = new Matrix(images)
      matrix.calc()
      // output png
      const inputs = images.map((image) => {
        return { input: image.rendered_image!, top: image.y, left: image.x }
      })
      await sharp({
        create: {
          width: matrix.max_x,
          height: matrix.max_y,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .composite(inputs)
        .png()
        .toFile(output_png)
      // output json
      const json: { [index: string]: SpriteImage } = {}
      images.forEach((image) => {
        json[image.name] = image.to_obj()
      })
      fs.writeFileSync(output_json, JSON.stringify(json))
    }
  )
}

export const generateSprite = async (
  output_file_name: string,
  input_directories: string[],
  ratios: number[] = [1]
): Promise<void> => {
  const promises: Promise<void>[] = []
  ratios.forEach((ratio) => {
    promises.push(
      generate(output_file_name, input_directories, ratio, ratios.length > 1)
    )
  })
  await Promise.all(promises)
}
