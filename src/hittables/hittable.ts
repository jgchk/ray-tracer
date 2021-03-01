import { pipe } from 'https://deno.land/x/hkts@v0.0.49/fns.ts'
import * as R from '../lib/ray.ts'
import * as V from '../lib/vec3.ts'

export type HitRecord =
  {
    p: V.Vec3
    normal: V.Vec3
    t: number
    isOutside: boolean
  }

export const hitRecord =
  (t: number, p: V.Vec3, outwardNormal: V.Vec3, isOutside: boolean) =>
  ({
    t,
    p,
    normal: isOutside ? outwardNormal : V.negate(outwardNormal),
    isOutside
  })

export type HitFunction =
  (r: R.Ray) => (tMin: number) => (tMax: number) => HitRecord | undefined

export const isOutside =
  (outwardNormal: V.Vec3) => (r: R.Ray) =>
  pipe(r.direction, V.dot(outwardNormal)) < 0
