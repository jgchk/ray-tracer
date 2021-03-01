import { pipe } from 'https://deno.land/x/hkts@v0.0.49/fns.ts'

import * as R from './lib/ray.ts'
import * as V from './lib/vec3.ts'
import * as C from './lib/camera.ts'

import * as H from './hittables/index.ts'
import { collection } from './hittables/collection.ts'
import { sphere } from './hittables/sphere.ts'

import * as M from './materials/index.ts'
import { dialectric } from './materials/dialectric.ts'
import { lambertian } from './materials/lambertian.ts'
import { metal } from './materials/metal.ts'

import { write } from './utils/color.ts'
import { random, randomRange } from './utils/random.ts'

const randomScene =
  () =>
  {
    const objects: H.Hittable[] = []

    const groundMaterial = lambertian(V.vec3(0.5, 0.5, 0.5))
    objects.push(sphere(V.vec3(0, -1000, 0), 1000, groundMaterial))

    for (let a = -11; a < 11; a++) {
      for (let b = -11; b < 11; b++) {
        const chooseMat = random()
        const center = V.vec3(a + 0.9*random(), 0.2, b + 0.9*random())

        if (V.length(pipe(center, V.subtract(V.vec3(4, 0.2, 0)))) > 0.9) {
          let sphereMaterial: M.Material

          if (chooseMat < 0.8) {
            // diffuse
            const albedo = V.attenuate(V.random())(V.random())
            sphereMaterial = lambertian(albedo)
          } else if (chooseMat < 0.95) {
            // metal
            const albedo = V.randomRange(0.5)(1)
            const fuzz = randomRange(0)(0.5)
            sphereMaterial = metal(albedo, fuzz)
          } else {
            sphereMaterial = dialectric(1.5)
          }

          objects.push(sphere(center, 0.2, sphereMaterial))
        }
      }
    }

    const material1 = dialectric(1.5)
    objects.push(sphere(V.vec3(0, 1, 0), 1, material1))

    const material2 = lambertian(V.vec3(0.4, 0.2, 0.1))
    objects.push(sphere(V.vec3(-4, 1, 0), 1, material2))

    const material3 = metal(V.vec3(0.7, 0.6, 0.5), 0)
    objects.push(sphere(V.vec3(4, 1, 0), 1, material3))

    return collection(objects)
  }

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
    const aspectRatio = 3 / 2
    const imageWidth = 1200
    const imageHeight = Math.floor(imageWidth / aspectRatio)
    const samplesPerPixel = 500
    const maxDepth = 50

    // World
    const world = randomScene()

    // Camera
    const lookFrom = V.vec3(13, 2, 3)
    const lookAt = V.vec3(0, 0, 0)
    const vUp = V.vec3(0, 1, 0)
    const distToFocus = 10
    const aperture = 0.1
    const camera = C.camera(lookFrom, lookAt, vUp, 20, aspectRatio, aperture, distToFocus)

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
