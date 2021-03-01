import { ScatterFunction } from '../lib/material.ts'
import * as dialectric from './dialectric.ts'
import * as lambertian from './lambertian.ts'
import * as metal from './metal.ts'

export type Material =
  | dialectric.Dialectric
  | lambertian.Lambertian
  | metal.Metal

export const scatter =
  (material: Material): ScatterFunction =>
  {
    switch (material.tag) {
      case 'Dialectric':
        return dialectric.scatter(material)
      case 'Lambertian':
        return lambertian.scatter(material)
      case 'Metal':
        return metal.scatter(material)
    }
  }