import { pipe } from 'https://deno.land/x/hkts@v0.0.49/fns.ts'
import { degreesToRadians } from '../utils/math.ts'
import { ray } from './ray.ts'
import * as V from './vec3.ts'

export type Camera =
  {
    origin: V.Vec3
    lowerLeftCorner: V.Vec3
    horizontal: V.Vec3
    vertical: V.Vec3
    u: V.Vec3
    v: V.Vec3
    w: V.Vec3
    lensRadius: number
  }

export const camera =
  (lookFrom: V.Vec3, lookAt: V.Vec3, vUp: V.Vec3, vFov: number, aspectRatio: number, aperture: number, focusDist: number): Camera =>
  {
    const theta = degreesToRadians(vFov)
    const h = Math.tan(theta / 2)
    const viewportHeight = 2 * h
    const viewportWidth = aspectRatio * viewportHeight

    const w = V.unitVector(pipe(lookFrom, V.subtract(lookAt)))
    const u = V.unitVector(V.cross(w)(vUp))
    const v = V.cross(u)(w)

    const origin = lookFrom
    const horizontal = V.multiply(focusDist * viewportWidth)(u)
    const vertical = V.multiply(focusDist * viewportHeight)(v)
    const lowerLeftCorner = pipe(
      origin,
      V.subtract(pipe(horizontal, V.divide(2))),
      V.subtract(pipe(vertical, V.divide(2))),
      V.subtract(V.multiply(focusDist)(w))
    )

    const lensRadius = aperture / 2

    return { origin, horizontal, vertical, lowerLeftCorner, u, v, w, lensRadius }
  }

export const getRay =
  (s: number) => (t: number) => ({ origin, lowerLeftCorner, horizontal, vertical, u, v, lensRadius }: Camera) =>
  {
    const rd = V.multiply(lensRadius)(V.randomInUnitDisk())
    const offset = V.add(V.multiply(rd.x)(u))(V.multiply(rd.y)(v))

    return ray(V.add(origin)(offset))(pipe(
      lowerLeftCorner,
      V.add(pipe(horizontal, V.multiply(s))),
      V.add(pipe(vertical, V.multiply(t))),
      V.subtract(origin),
      V.subtract(offset)
    ))
  }