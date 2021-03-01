import { pipe } from 'https://deno.land/x/hkts@v0.0.49/fns.ts'

import * as C from './lib/color.ts'
import * as R from './lib/ray.ts'
import * as V from './lib/vec3.ts'

import * as I from './hittables/index.ts'
import { collection } from './hittables/collection.ts'
import { sphere } from './hittables/sphere.ts'

const rayColor =
  (r: R.Ray) => (world: I.Hittable) => 
  {
    const hit = I.hit(world)(r)(0)(Infinity)
    if (hit)
      return pipe(hit.normal, V.add(V.vec3(1, 1, 1)), V.multiply(0.5))

    const unitDirection = V.unitVector(r.direction)
    const t = 0.5 * (unitDirection.y + 1)
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

    // World
    const world = collection([
      sphere(V.vec3(0, 0, -1), 0.5),
      sphere(V.vec3(0, -100.5, -1), 100)
    ])

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
        const pixelColor = rayColor(r)(world)
        C.write(pixelColor)
      }
    }

    console.error('Done.')
  }

main()
