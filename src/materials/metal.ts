import { HitRecord } from '../lib/hittable.ts'
import * as M from '../lib/material.ts'
import * as R from '../lib/ray.ts'
import * as V from '../lib/vec3.ts'

export type Metal =
  { tag: 'Metal', albedo: V.Vec3 }

export const metal =
  (albedo: V.Vec3): Metal =>
  ({ tag: 'Metal', albedo })

export const scatter =
  ({ albedo }: Metal) => (rIn: R.Ray) => (hit: HitRecord): M.ScatterRecord | undefined =>
  {
    const reflected = V.reflect(hit.normal)(V.unitVector(rIn.direction))
    const scattered = R.ray(hit.p)(reflected)
    
    if (V.dot(scattered.direction)(hit.normal) > 0)
      return M.scatterRecord(scattered)(albedo)
  }