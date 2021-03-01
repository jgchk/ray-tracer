import * as M from '../lib/material.ts'
import { ray } from '../lib/ray.ts'
import * as V from '../lib/vec3.ts'
import { random } from '../utils/random.ts'

export type Dialectric =
  { tag: 'Dialectric'; ir: number }

export const dialectric =
  (ir: number): Dialectric =>
  ({ tag: 'Dialectric', ir })

export const scatter =
  ({ ir }: Dialectric): M.ScatterFunction => (rIn) => (hit) =>
  {
    const refractionRatio = hit.isOutside ? (1 / ir) : ir
    const unitDirection = V.unitVector(rIn.direction)
    const cosTheta = Math.min(V.dot(V.negate(unitDirection))(hit.normal), 1)
    const sinTheta = Math.sqrt(1 - cosTheta*cosTheta)

    const cannotRefract = refractionRatio * sinTheta > 1
    const direction = (cannotRefract || reflectance(cosTheta)(refractionRatio) > random())
      ? V.reflect(unitDirection)(hit.normal)
      : V.refract(unitDirection)(hit.normal)(refractionRatio)

    const scattered = ray(hit.p)(direction)
    const attenuation = V.vec3(1, 1, 1)
    return M.scatterRecord(scattered)(attenuation)
  }

const reflectance =
  (cos: number) => (refIndex: number) => 
  {
    // Use Schlick's approximation for reflectance
    let r0 = (1 - refIndex) / (1 + refIndex)
    r0 = r0*r0
    return r0 + (1 - r0) * Math.pow(1 - cos, 5)
  }