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
  buffer_length = 3
  rendered_image: Buffer | null = null
  sdf = false

  x = 0
  y = 0
  constructor(
    source_file: string,
    ratio: number,
    name: string,
    file_ratio?: number,
  ) {
    this.source_file = source_file
    this.name = name
    this.ratio = ratio
    this.file_ratio = file_ratio || 1

    if (this.file_ratio > 1 && this.ratio !== this.file_ratio) {
      throw new Error(
        `If the file_ratio is not 1, it must be equal to the ratio`,
      )
    }
  }

  async parse(sdf: boolean = false) {
    const metadata = await sharp(this.source_file).metadata()
    this.width = metadata.width!
    this.height = metadata.height!
    this.range = this.width * this.height
    this.sdf = sdf

    this.rendered_image
    const intermediate_image = sharp(this.source_file)
    if (
      this.real_height() !== this.height ||
      this.real_width() !== this.width
    ) {
      this.rendered_image = await intermediate_image
        .resize(this.real_width(), this.real_height())
        .toBuffer()
    } else {
      // because the image is already at the specified size, we can use it directly.
      this.rendered_image = await intermediate_image.toBuffer()
    }
    // add buffer
    this.rendered_image = await sharp({
        create: {
          width: this.buffer_width(),
          height: this.buffer_height(),
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
      .composite([{
        input: this.rendered_image!,
        top: this.buffer_length,
        left: this.buffer_length,
      }])
      .png()
      .toBuffer()

    if (sdf) {
      const radius = 8
      const img = this.rendered_image
      const pixelArray = new Uint8ClampedArray(img!.buffer)
      const alphas = []
      for (let i = 0; i < pixelArray.length; i += 4) {
        const alpha = pixelArray[i + 3]
        alphas.push(alpha)
      }
      const outer_df = alphas.map((alpha) => {
        if (alpha === 0) return Number.MAX_VALUE
        return Math.max(0, 0.5 - (alpha / 255))**2
      })
      const inner_df = alphas.map((alpha) => {
        if (alpha === 255) return Number.MAX_VALUE
        return Math.max(0, (alpha / 255) - 0.5)**2
      })
      for (let col = 0; col < this.buffer_width(); col++) {
        dt(outer_df, col, this.buffer_width(), this.buffer_height())
        dt(inner_df, col, this.buffer_width(), this.buffer_height())
      }
      for (let row = 0; row < this.buffer_height(); row++) {
        dt(outer_df, row * this.buffer_width(), 1, this.buffer_width())
        dt(inner_df, row * this.buffer_width(), 1, this.buffer_width())
      }
      const result = outer_df.map((outerDfValue, index) => {
        const innerDfValue = inner_df[index]
        return Math.min(1.0, Math.max(-1.0, (Math.sqrt(outerDfValue) - Math.sqrt(innerDfValue)) / radius))
      })
      const normalizedData = result.map(value => {
        return Math.round(((value + 1) / 2) * 255);
      })
      const buffer = Buffer.from(normalizedData)
      this.rendered_image = await sharp(buffer, {
        raw: {
          width: this.buffer_width(),
          height: this.buffer_height(),
          channels: 1
        }
      }).png().toBuffer()
    }
    return this
  }

  real_width() {
    return Math.round((this.width / this.file_ratio) * this.ratio)
  }

  real_height() {
    return Math.round((this.height / this.file_ratio) * this.ratio)
  }

  buffer_width() {
    return this.real_width() + this.buffer_length * 2
  }

  buffer_height() {
    return this.real_height() + this.buffer_length * 2
  }

  to_obj(): SpriteImage {
    return {
      height: this.buffer_height(),
      width: this.buffer_width(),
      x: this.x,
      y: this.y,
      pixelRatio: this.ratio,
      sdf: this.sdf,
    }
  }
}

// original code from https://github.com/stadiamaps/sdf_font_tools/blob/main/sdf_glyph_renderer/src/core.rs
function dt(grid: number[], offset: number, stepBy: number, size: number) {
  // f is a one-dimensional slice of the grid
  const f: number[] = []
  for (let i = offset; i < grid.length; i += stepBy) {
    f.push(grid[i])
  }

  let k = 0
  const v = new Array(size).fill(0)
  const z = new Array(size + 1).fill(Number.MIN_VALUE)
  z[1] = Number.MAX_VALUE
  let s: number

  for (let q = 1; q < size; q++) {
    while (true) {
      const q2 = q * q
      const vk2 = v[k] * v[k]
      const denom = 2 * q - 2 * v[k]
      s = ((f[q] + q2) - (f[v[k]] + vk2)) / denom

      if (s <= z[k]) {
        k -= 1
      } else {
        k += 1
        v[k] = q
        z[k] = s
        z[k + 1] = Number.MAX_VALUE

        break
      }
    }
  }

  k = 0
  for (let q = 0; q < size; q++) {
    const qf64 = q
    while (z[k + 1] < qf64) {
      k += 1
    }
    const vkf64 = v[k]
    grid[offset + q * stepBy] = (qf64 - vkf64) * (qf64 - vkf64) + f[v[k]]
  }
}
