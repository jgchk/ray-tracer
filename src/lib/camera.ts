import { pipe } from 'https://deno.land/x/hkts@v0.0.49/fns.ts'
import { ray } from './ray.ts'
import * as V from './vec3.ts'

export type Camera =
  {
    origin: V.Vec3
    lowerLeftCorner: V.Vec3
    horizontal: V.Vec3
    vertical: V.Vec3
  }

export const camera =
  (origin: V.Vec3, viewportWidth: number, viewportHeight: number, focalLength: number): Camera =>
  {
    const horizontal = V.vec3(viewportWidth, 0, 0)
    const vertical = V.vec3(0, viewportHeight, 0)
    const lowerLeftCorner = pipe(
      origin,
      V.subtract(pipe(horizontal, V.divide(2))),
      V.subtract(pipe(vertical, V.divide(2))),
      V.subtract(V.vec3(0, 0, focalLength)),
    )
    return { origin, horizontal, vertical, lowerLeftCorner }
  }

export const getRay =
  (u: number) => (v: number) => ({ origin, lowerLeftCorner, horizontal, vertical }: Camera) =>
  ray(origin)(pipe(
    lowerLeftCorner,
    V.add(pipe(horizontal, V.multiply(u))),
    V.add(pipe(vertical, V.multiply(v))),
    V.subtract(origin)
  ))