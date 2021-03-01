import { HitRecord } from '../lib/hittable.ts'
import * as M from '../lib/material.ts'
import * as R from '../lib/ray.ts'
import * as V from '../lib/vec3.ts'

export type Metal =
  { tag: 'Metal'; albedo: V.Vec3; fuzz: number }

export const metal =
  (albedo: V.Vec3, fuzz: number): Metal =>
  ({ tag: 'Metal', albedo, fuzz: fuzz < 1 ? fuzz : 1 })

export const scatter =
  ({ albedo, fuzz }: Metal) => (rIn: R.Ray) => (hit: HitRecord): M.ScatterRecord | undefined =>
  {
    const reflected = V.reflect(hit.normal)(V.unitVector(rIn.direction))
    const scattered = R.ray(hit.p)(V.add(reflected)(V.multiply(fuzz)(V.randomInUnitSphere())))
    if (V.dot(scattered.direction)(hit.normal) > 0)
      return M.scatterRecord(scattered)(albedo)
  }