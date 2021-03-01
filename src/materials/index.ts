import { ScatterFunction } from '../lib/material.ts'
import * as lambertian from './lambertian.ts'
import * as metal from './metal.ts'

export type Material =
  | lambertian.Lambertian
  | metal.Metal

export const scatter =
  (material: Material): ScatterFunction =>
  {
    switch (material.tag) {
      case 'Lambertian':
        return lambertian.scatter(material)
      case 'Metal':
        return metal.scatter(material)
    }
  }