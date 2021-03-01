import { HitFunction } from '../lib/hittable.ts'
import * as collection from './collection.ts'
import * as sphere from './sphere.ts'

export type Hittable =
  | collection.Collection
  | sphere.Sphere

export const hit =
  (hittable: Hittable): HitFunction =>
  {
    switch (hittable.tag) {
      case 'Collection':
        return collection.hit(hittable)
      case 'Sphere':
        return sphere.hit(hittable)
    }
  }