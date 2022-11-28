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
    // console.log(`entering: max: ${this.max_x},${this.max_y}, position: ${this.position_x},${this.position_y}`)

    if (this.position_y < this.max_y || this.position_y === 0) {
      // The current y position is less than the maximum y, or at 0, which means we will place the icon
      // vertically
      this.position_y += image.real_height()

      // if maximum x is not sufficient, we will extend it for this image
      if (this.max_x < this.position_x + image.real_width()) {
        this.max_x += image.real_width()
      }
      // if current y position is greater than or equal to maximum y, we will reset position x to 0, and set
      // the maximum y to the current y position (the height of this image has been factored in to this on line 27)
      if (this.position_y >= this.max_y) {
        this.position_x = 0
        this.max_y = this.position_y
      }
    } else if (this.position_x < this.max_x) {
      // the current x position is less than the maximum x, which means we will place the icon horizontally
      this.position_x += image.real_width()

      // if, by adding the image's width, we go greater than the maximum x, then we will reset the maximum x to
      // the current x position
      if (this.position_x > this.max_x) {
        this.max_x = this.position_x
      }
    } else {
      // the current y position is neither less than maximum y, nor is it 0.
      // the current x position is not less than the maximum x

      // if maximum y is not large enough to fit the image, extend the maximum y to fit
      if (this.max_y <= this.position_y + image.real_height()) {
        this.max_y += image.real_height()
      }

      // reset current y position to zero
      this.position_y = 0

      // if the maximum x is not large enough to fit the image, expand the maximum x to fit
      if (this.max_x <= this.position_x + image.real_width()) {
        this.max_x += image.real_width()
      }

      // reset the current x position to the maximum x position
      this.position_x = this.max_x
    }
    // console.log(`leaving: max: ${this.max_x},${this.max_y}, position: ${this.position_x},${this.position_y}`)
  }
}
