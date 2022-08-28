import sharp from 'sharp'

export class Image {
  svg_file: string
  name: string
  ratio: number
  width = 0
  height = 0
  range = 1

  x = 0
  y = 0
  constructor(svg_file: string, ratio: number) {
    this.svg_file = svg_file
    this.name = svg_file.match(/([^/]*)\./)![1]
    this.ratio = ratio
  }

  async parse() {
    const metadata = await sharp(this.svg_file).metadata()
    this.width = metadata.width!
    this.height = metadata.height!
    this.range = this.width * this.height
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

  to_obj() {
    return {
      height: this.real_height(),
      width: this.real_width(),
      x: this.x,
      y: this.y,
      pixelRatio: this.ratio,
    }
  }
}
