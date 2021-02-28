import * as color from './color.ts'
import * as vec3 from './vec3.ts'

const main = () => {
  const imageWidth = 256
  const imageHeight = 256

  console.log('P3')
  console.log(`${imageWidth} ${imageHeight}`)
  console.log('255')

  for (let j = imageHeight - 1; j >= 0; j--) {
    console.error(`Scanlines remaining: ${j}`)
    for (let i = 0; i < imageWidth; i++) {
      const c = vec3.vec3(i / (imageWidth - 1))(j / (imageHeight - 1))(0.25)
      color.write(c)
    }
  }

  console.error('Done.')
}

main()
