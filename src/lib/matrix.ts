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
    this.images.forEach((image) => {
      image.x = this.position_x
      image.y = this.position_y
      this._set_next_position(image)
    })
  }

  _set_next_position(image: Image) {
    if (this.position_y < this.max_y || this.position_y === 0) {
      this.position_y += image.real_height()
      if (this.max_x < this.position_x + image.real_width()) {
        this.max_x += image.real_width()
      }
      if (this.position_y >= this.max_y) {
        this.position_x = 0
        this.max_y = this.position_y
      }
    } else if (this.position_x < this.max_x) {
      this.position_x += image.real_width()
      if (this.position_x > this.max_x) {
        this.max_x = this.position_x
      }
    } else {
      if (this.max_y <= this.position_y + image.real_height()) {
        this.max_y += image.real_height()
      }
      this.position_y = 0
      if (this.max_x <= this.position_x + image.real_width()) {
        this.max_x += image.real_width()
      }
      this.position_x = this.max_x
    }
  }
}
