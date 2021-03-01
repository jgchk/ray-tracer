import { pipe } from 'https://deno.land/x/hkts@v0.0.49/fns.ts'
import { Material } from '../materials/index.ts'
import * as R from './ray.ts'
import * as V from './vec3.ts'

export type HitRecord =
  {
    p: V.Vec3
    normal: V.Vec3
    material: Material
    t: number
    isOutside: boolean
  }

export const hitRecord =
  (t: number, p: V.Vec3, material: Material, outwardNormal: V.Vec3, isOutside: boolean): HitRecord =>
  ({
    t,
    p,
    material,
    normal: isOutside ? outwardNormal : V.negate(outwardNormal),
    isOutside
  })

export type HitFunction =
  (r: R.Ray) => (tMin: number) => (tMax: number) => HitRecord | undefined

export const isOutside =
  (outwardNormal: V.Vec3) => (r: R.Ray) =>
  V.dot(r.direction)(outwardNormal) < 0
