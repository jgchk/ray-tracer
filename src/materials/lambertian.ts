import { pipe } from 'https://deno.land/x/hkts@v0.0.49/fns.ts'
import { HitRecord } from '../lib/hittable.ts'
import * as M from '../lib/material.ts'
import * as R from '../lib/ray.ts'
import * as V from '../lib/vec3.ts'

export type Lambertian =
  { tag: 'Lambertian'; albedo: V.Vec3 }

export const lambertian =
  (albedo: V.Vec3): Lambertian =>
  ({ tag: 'Lambertian', albedo })

export const scatter =
  ({ albedo }: Lambertian) => (rIn: R.Ray) => (hit: HitRecord): M.ScatterRecord | undefined =>
  {
    let scatterDirection = pipe(hit.normal, V.add(V.randomUnitVector()))

    // Catch degenerate scatter direction
    if (V.nearZero(scatterDirection))
      scatterDirection = hit.normal

    const scattered = R.ray(hit.p)(scatterDirection)
    return M.scatterRecord(scattered)(albedo)
  }