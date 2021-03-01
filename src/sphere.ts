import { pipe } from 'https://deno.land/x/hkts@v0.0.49/fns.ts'
import * as R from './ray.ts'
import * as V from './vec3.ts'
import * as H from './hittable.ts'

export class Sphere implements H.Hittable {
  center: V.Vec3
  radius: number

  constructor(center: V.Vec3, radius: number) {
    this.center = center
    this.radius = radius
  }

  hit: H.HitFunction =
    (r) => (tMin) => (tMax) =>
    {
      const oc = pipe(r.origin, V.subtract(this.center))
      const a = V.lengthSquared(r.direction)
      const halfB = pipe(oc, V.dot(r.direction))
      const c = V.lengthSquared(oc) - this.radius*this.radius

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
      const outwardNormal = pipe(p, V.subtract(this.center), V.divide(this.radius))
      const isOutside = H.isOutside(outwardNormal)(r)
      return new H.HitRecord(t, p, outwardNormal, isOutside)
    }
}
