import { pipe } from 'https://deno.land/x/compose@1.3.2/index.js'
import * as C from './color.ts'
import * as R from './ray.ts'
import * as V from './vec3.ts'

const hitSphere =
  (center: V.Vec3) => (radius: number) => (r: R.Ray) =>
  {
    const oc = pipe(r.origin, V.subtract(center))
    const a = V.dot(r.direction)(r.direction)
    const b = 2 * pipe(oc, V.dot(r.direction))
    const c = V.dot(oc)(oc) - radius*radius
    const discriminant = b*b - 4*a*c
    return discriminant > 0
  }

const rayColor =
  (r: R.Ray) => 
  {
    if (hitSphere(V.vec3(0)(0)(-1))(0.5)(r))
      return V.vec3(1)(0)(0)
    const unitDirection = V.unitVector(r.direction)
    const t = 0.5 * (unitDirection.y + 1)
    return pipe(
      pipe(V.vec3(1)(1)(1), V.multiply(1 - t)),
      V.add(pipe(V.vec3(0.5)(0.7)(1), V.multiply(t)))
    )
  }

const main =
  () => 
  {
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
      V.subtract(pipe(horizontal, V.divide(2))),
      V.subtract(pipe(vertical, V.divide(2))),
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
          V.add(pipe(horizontal, V.multiply(u))),
          V.add(pipe(vertical, V.multiply(v))),
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
