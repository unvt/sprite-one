import path from 'node:path'
import sharp from 'sharp'
import { SpriteImage } from './interfaces'

export class Image {
  source_file: string
  name: string
  ratio: number
  file_ratio: number
  width = 0
  height = 0
  range = 1
  rendered_image: Buffer | null = null

  x = 0
  y = 0
  constructor(source_file: string, ratio: number, name: string, file_ratio?: number) {
    this.source_file = source_file
    this.name = name
    this.ratio = ratio
    this.file_ratio = file_ratio || 1

    if (this.file_ratio > 1 && this.ratio !== this.file_ratio) {
      throw new Error(`If the file_ratio is not 1, it must be equal to the ratio`)
    }
  }

  async parse() {
    const metadata = await sharp(this.source_file).metadata()
    this.width = metadata.width!
    this.height = metadata.height!
    this.range = this.width * this.height

    this.rendered_image
    const intermediate_image = sharp(this.source_file)
    if (this.real_height() !== this.height || this.real_width() !== this.width) {
      this.rendered_image = await intermediate_image
        .resize(
          this.real_width(),
          this.real_height(),
        )
        .toBuffer()
    } else {
      // because the image is already at the specified size, we can use it directly.
      this.rendered_image = await intermediate_image.toBuffer()
    }

    return this
  }

  real_width() {
    return Math.round((this.width / this.file_ratio) * this.ratio)
  }

  real_height() {
    return Math.round((this.height / this.file_ratio) * this.ratio)
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
