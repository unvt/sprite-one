import path from 'path'
import * as fs from 'fs'
import { Image } from './image'
import { Matrix } from './matrix'
import sharp from 'sharp'
export const generateSprite = async (
  output_file_name: string,
  input_directory: string,
  ratio = 1
): Promise<void> => {
  const output_json = `${output_file_name}.json`
  const output_png = `${output_file_name}.png`
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
  Promise.all(images.map((image) => image.parse())).then((images) => {
    images.sort((a, b) => a.range - b.range)
    const matrix = new Matrix(images)
    matrix.calc()
    // output png
    const inputs = images.map((image) => {
      return { input: image.svg_obj!, top: image.y, left: image.x }
    })
    sharp({
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
      .then(() => {})
      .catch((err) => {
        console.log(err)
      })
    // output json
    const json: { [index: string]: any } = {}
    images.forEach((image) => {
      json[image.name] = image.to_obj()
    })
    fs.writeFileSync(output_json, JSON.stringify(json))
  })
}
