import { pipe } from 'https://deno.land/x/compose@1.3.2/index.js'
import * as C from './color.ts'
import * as R from './ray.ts'
import * as V from './vec3.ts'

const hitSphere =
  (center: V.Vec3) => (radius: number) => (r: R.Ray) =>
  {
    const oc = pipe(r.origin, V.subtract(center))
    const a = V.lengthSquared(r.direction)
    const halfB = pipe(oc, V.dot(r.direction))
    const c = V.lengthSquared(oc) - radius*radius
    const discriminant = halfB*halfB - a*c

    if (discriminant < 0) {
      return -1
    } else {
      return (-halfB - Math.sqrt(discriminant)) / a
    }
  }

const rayColor =
  (r: R.Ray) => 
  {
    let t = hitSphere(V.vec3(0, 0, -1))(0.5)(r)
    if (t > 0) {
      const n = pipe(R.at(t)(r), V.subtract(V.vec3(0, 0, -1)), V.unitVector)
      return V.multiply(0.5)(V.vec3(n.x + 1, n.y + 1, n.z + 1))
    }
    const unitDirection = V.unitVector(r.direction)
    t = 0.5 * (unitDirection.y + 1)
    return pipe(
      pipe(V.vec3(1, 1, 1), V.multiply(1 - t)),
      V.add(pipe(V.vec3(0.5, 0.7, 1), V.multiply(t)))
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

    const origin = V.vec3(0, 0, 0)
    const horizontal = V.vec3(viewportWidth, 0, 0)
    const vertical = V.vec3(0, viewportHeight, 0)
    const lowerLeftCorner = pipe(
      origin,
      V.subtract(pipe(horizontal, V.divide(2))),
      V.subtract(pipe(vertical, V.divide(2))),
      V.subtract(V.vec3(0, 0, focalLength)),
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
