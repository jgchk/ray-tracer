import { pipe } from 'https://deno.land/x/hkts@v0.0.49/fns.ts'
import * as H from '../lib/hittable.ts'
import * as R from '../lib/ray.ts'
import * as V from '../lib/vec3.ts'
import { Material } from '../materials/index.ts'

export type Sphere =
  {
    tag: 'Sphere'
    center: V.Vec3
    radius: number
    material: Material
  }

export const sphere =
  (center: V.Vec3, radius: number, material: Material): Sphere =>
  ({ tag: 'Sphere', center, radius, material })

export const hit =
  ({ center, radius, material }: Sphere) => (r: R.Ray) => (tMin: number) => (tMax: number): H.HitRecord | undefined =>
  {
    const oc = pipe(r.origin, V.subtract(center))
    const a = V.lengthSquared(r.direction)
    const halfB = V.dot(oc)(r.direction)
    const c = V.lengthSquared(oc) - radius*radius

    const discriminant = halfB*halfB - a*c
    if (discriminant < 0) return undefined
    const sqrtd = Math.sqrt(discriminant)

    // Find the nearest root that lies in the acceptable range
    let root = (-halfB - sqrtd) / a
    if (root < tMin || tMax < root) {
      root = (-halfB + sqrtd) / a
      if (root < tMin || tMax < root)
        return undefined
    }

    const t = root
    const p = R.at(t)(r)
    const outwardNormal = pipe(p, V.subtract(center), V.divide(radius))
    const isOutside = H.isOutside(outwardNormal)(r)
    return H.hitRecord(t, p, material, outwardNormal, isOutside)
  }
