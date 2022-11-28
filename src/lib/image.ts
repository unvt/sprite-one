import path from 'node:path'
import sharp from 'sharp'
import { SpriteImage } from './interfaces'

export class Image {
  svg_file: string
  name: string
  ratio: number
  width = 0
  height = 0
  range = 1
  svg_obj: Buffer | null = null

  x = 0
  y = 0
  constructor(svg_file: string, ratio: number, name?: string) {
    this.svg_file = svg_file
    this.name = typeof name !== 'undefined' ? name : path.basename(svg_file).match(/([^/]*)\./)![1]
    this.ratio = ratio
  }

  async parse() {
    const metadata = await sharp(this.svg_file).metadata()
    this.width = metadata.width!
    this.height = metadata.height!
    this.range = this.width * this.height
    this.svg_obj = await sharp(this.svg_file)
      .resize(
        Math.round(this.width * this.ratio),
        Math.round(this.height * this.ratio)
      )
      .toBuffer()
    // console.log(
    //   `name: ${this.name}, width: ${this.width}, height: ${this.height}, range: ${this.range}`
    // )
    return this
  }

  real_width() {
    return this.width * this.ratio
  }

  real_height() {
    return this.height * this.ratio
  }

  to_obj(): SpriteImage {
    return {
      height: this.real_height(),
      width: this.real_width(),
      x: this.x,
      y: this.y,
      pixelRatio: this.ratio,
    }
  }
}
