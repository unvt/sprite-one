import binPack from 'bin-pack'
import { Image } from './image'

export class Matrix {
  images: Image[]
  position_x = 0
  position_y = 0
  max_x = 0
  max_y = 0
  constructor(images: Image[]) {
    this.images = images
  }

  calc() {
    const result = binPack(
      this.images.map((image) => {
        return {
          image,
          width: image.buffer_width(),
          height: image.buffer_height(),
        }
      }),
    )
    this.max_x = result.width
    this.max_y = result.height
    for (const obj of result.items) {
      obj.item.image.x = obj.x
      obj.item.image.y = obj.y
    }
  }
}
