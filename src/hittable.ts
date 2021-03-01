import { pipe } from 'https://deno.land/x/hkts@v0.0.49/fns.ts'
import * as R from './ray.ts'
import * as V from './vec3.ts'

export class HitRecord {
  p: V.Vec3
  normal: V.Vec3
  t: number
  isOutside: boolean

  constructor(t: number, p: V.Vec3, outwardNormal: V.Vec3, isOutside: boolean) {
    this.t = t
    this.p = p
    this.normal = isOutside ? outwardNormal : V.negate(outwardNormal)
    this.isOutside = isOutside
  }
}

export type HitFunction =
  (r: R.Ray) => (tMin: number) => (tMax: number) => HitRecord | undefined

export interface Hittable
  { hit: HitFunction }

export const isOutside =
  (outwardNormal: V.Vec3) => (r: R.Ray) =>
  pipe(r.direction, V.dot(outwardNormal)) < 0

export class Hittables implements Hittable {
  hittables: Hittable[]

  constructor(hittables: Hittable[]) {
    this.hittables = hittables
  }

  hit: HitFunction =
    (r) => (tMin) => (tMax) =>
    {
      let closestHit: HitRecord | undefined = undefined

      for (const hittable of this.hittables) {
        const hit = hittable.hit(r)(tMin)(closestHit?.t ?? tMax)
        if (hit) {
          closestHit = hit
        }
      }

      return closestHit
    }
}