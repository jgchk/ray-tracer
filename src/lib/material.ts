import { HitRecord } from './hittable.ts'
import { Ray } from './ray.ts'
import { Vec3 } from './vec3.ts'

export type ScatterRecord =
  { scattered: Ray; attenuation: Vec3 }

export const scatterRecord =
  (scattered: Ray) => (attenuation: Vec3) =>
  ({ scattered, attenuation })

export type ScatterFunction =
  (rIn: Ray) => (hit: HitRecord) => ScatterRecord | undefined
