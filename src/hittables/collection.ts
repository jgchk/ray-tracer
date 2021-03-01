import { HitRecord } from '../lib/hittable.ts'
import { Ray } from '../lib/ray.ts'
import * as I from './index.ts'

export type Collection =
  { tag: 'Collection', hittables: I.Hittable[] }

export const collection =
  (hittables: I.Hittable[]): Collection =>
  ({ tag: 'Collection', hittables })

export const hit =
  ({ hittables }: Collection) => (r: Ray) => (tMin: number) => (tMax: number): HitRecord | undefined =>
  {
    let closestHit: HitRecord | undefined = undefined

      for (const hittable of hittables) {
        const hit = I.hit(hittable)(r)(tMin)(closestHit?.t ?? tMax)
        if (hit) {
          closestHit = hit
        }
      }

      return closestHit
  }