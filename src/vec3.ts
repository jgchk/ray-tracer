import { compose } from 'https://deno.land/x/compose@1.3.2/index.js'

export type Vec3 =
  { x: number; y: number; z: number }

export const vec3 = 
  (x: number) => (y: number) => (z: number) =>
  ({ x, y, z })

export const lengthSquared =
  ({ x, y, z }: Vec3) => x*x + y*y + z*z

export const length =
  compose(Math.sqrt, lengthSquared)

