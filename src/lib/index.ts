import path from 'path'
import * as fs from 'fs'
import { Image } from './image'
import { Matrix } from './matrix'
import sharp from 'sharp'
import { SpriteImage } from './interfaces'

const generate = async (
  output_file_name: string,
  input_directory: string,
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
  const images: Image[] = []
  const files = fs.readdirSync(input_directory)
  files.forEach((file) => {
    if (file.match(/[^.]+$/)?.toString() === 'svg') {
      const svg_file = path.join(input_directory, file)
      const image = new Image(svg_file, ratio)
      images.push(image)
    }
  })
  return Promise.all(images.map((image) => image.parse())).then(
    async (images) => {
      images.sort((a, b) => a.range - b.range)
      const matrix = new Matrix(images)
      matrix.calc()
      // output png
      const inputs = images.map((image) => {
        return { input: image.svg_obj!, top: image.y, left: image.x }
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
  input_directory: string,
  ratios: number[] = [1]
): Promise<void> => {
  const promises: Promise<void>[] = []
  ratios.forEach((ratio) => {
    promises.push(
      generate(output_file_name, input_directory, ratio, ratios.length > 1)
    )
  })
  await Promise.all(promises)
}
