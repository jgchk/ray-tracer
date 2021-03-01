import * as C from './color.ts'
import * as R from './ray.ts'
import * as V from './vec3.ts'
import { pipe } from 'https://deno.land/x/compose@1.3.2/index.js'

const rayColor = (r: R.Ray) => {
  const unitDirection = V.unitVector(r.direction)
  const t = 0.5 * (unitDirection.y + 1)
  return V.add(V.multiply(1 - t)(V.vec3(1)(1)(1)))(V.multiply(t)(V.vec3(0.5)(0.7)(1)))
}

const main = () => {
  // Image
  const aspectRatio = 16 / 9
  const imageWidth = 400
  const imageHeight = Math.floor(imageWidth / aspectRatio)

  // Camera
  const viewportHeight = 2
  const viewportWidth = aspectRatio * viewportHeight
  const focalLength = 1

  const origin = V.vec3(0)(0)(0)
  const horizontal = V.vec3(viewportWidth)(0)(0)
  const vertical = V.vec3(0)(viewportHeight)(0)
  const lowerLeftCorner = pipe(
    origin,
    V.subtract(V.divide(2)(horizontal)),
    V.subtract(V.divide(2)(horizontal)),
    V.subtract(V.vec3(0)(0)(focalLength)),
  )

  // Render
  console.log('P3')
  console.log(`${imageWidth} ${imageHeight}`)
  console.log('255')

  for (let j = imageHeight - 1; j >= 0; j--) {
    console.error(`Scanlines remaining: ${j}`)
    for (let i = 0; i < imageWidth; i++) {
      const u = i / (imageWidth - 1)
      const v = j / (imageHeight - 1)

      const d = pipe(
        lowerLeftCorner,
        V.add(V.multiply(u)(horizontal)),
        V.add(V.multiply(v)(vertical)),
        V.subtract(origin)
      )
      const r = R.ray(origin)(d)
      const pixelColor = rayColor(r)
      C.write(pixelColor)
    }
  }

  console.error('Done.')
}

main()
