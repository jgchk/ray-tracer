import { pipe } from 'https://deno.land/x/hkts@v0.0.49/fns.ts'

import * as R from './lib/ray.ts'
import * as V from './lib/vec3.ts'
import * as C from './lib/camera.ts'

import * as H from './hittables/index.ts'
import { collection } from './hittables/collection.ts'
import { sphere } from './hittables/sphere.ts'

import * as M from './materials/index.ts'
import { lambertian } from './materials/lambertian.ts'
import { metal } from './materials/metal.ts'

import { write } from './utils/color.ts'
import { random } from './utils/random.ts'

const rayColor =
  (r: R.Ray) => (world: H.Hittable) => (depth: number): V.Vec3 => 
  {
    if (depth <= 0)
      return V.vec3(0, 0, 0)

    const hit = H.hit(world)(r)(0.001)(Infinity)
    if (hit) {
      const scatter = M.scatter(hit.material)(r)(hit)
      if (!scatter) return V.vec3(0, 0, 0)
      return V.attenuate(scatter.attenuation)(rayColor(scatter.scattered)(world)(depth - 1))
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
    const materialGround = lambertian(V.vec3(0.8, 0.8, 0))
    const materialCenter = lambertian(V.vec3(0.7, 0.3, 0.3))
    const materialLeft = metal(V.vec3(0.8, 0.8, 0.8))
    const materialRight = metal(V.vec3(0.8, 0.6, 0.2))
    const world = collection([
      sphere(V.vec3(0, -100.5, -1), 100, materialGround),
      sphere(V.vec3(0, 0, -1), 0.5, materialCenter),
      sphere(V.vec3(-1, 0, -1), 0.5, materialLeft),
      sphere(V.vec3(1, 0, -1), 0.5, materialRight)
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
