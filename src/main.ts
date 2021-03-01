import { pipe } from 'https://deno.land/x/hkts@v0.0.49/fns.ts'

import * as R from './lib/ray.ts'
import * as V from './lib/vec3.ts'
import * as C from './lib/camera.ts'

import * as I from './hittables/index.ts'
import { collection } from './hittables/collection.ts'
import { sphere } from './hittables/sphere.ts'

import { write } from './utils/color.ts'
import { random } from './utils/random.ts'

const rayColor =
  (r: R.Ray) => (world: I.Hittable) => (depth: number): V.Vec3 => 
  {
    if (depth <= 0)
      return V.vec3(0, 0, 0)

    const hit = I.hit(world)(r)(0.001)(Infinity)
    if (hit) {
      const target = pipe(hit.p, V.add(hit.normal), V.add(V.randomUnitVector()))
      return pipe(
        rayColor(R.ray(hit.p)(pipe(target, V.subtract(hit.p))))(world)(depth - 1),
        V.multiply(0.5)
      )
    }

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
    const samplesPerPixel = 100
    const maxDepth = 50

    // World
    const world = collection([
      sphere(V.vec3(0, 0, -1), 0.5),
      sphere(V.vec3(0, -100.5, -1), 100)
    ])

    // Camera
    const viewportHeight = 2
    const viewportWidth = aspectRatio * viewportHeight
    const camera = C.camera(V.vec3(0, 0, 0), viewportWidth, viewportHeight, 1)

    // Render
    console.log('P3')
    console.log(`${imageWidth} ${imageHeight}`)
    console.log('255')

    for (let j = imageHeight - 1; j >= 0; j--) {
      console.error(`Scanlines remaining: ${j}`)
      for (let i = 0; i < imageWidth; i++) {
        let color = V.vec3(0, 0, 0)
        for (let s = 0; s < samplesPerPixel; s++) {
          const u = (i + random()) / (imageWidth - 1)
          const v = (j + random()) / (imageHeight - 1)
          const r = C.getRay(u)(v)(camera)
          color = V.add(rayColor(r)(world)(maxDepth))(color)
        }
        write(samplesPerPixel)(color)
      }
    }

    console.error('Done.')
  }

main()
