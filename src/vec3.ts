import { compose } from 'https://deno.land/x/compose@1.3.2/index.js'

export type Vec3 =
  { x: number; y: number; z: number }

export const vec3 = 
  (x: number) => (y: number) => (z: number) =>
  ({ x, y, z })

export const add =
  (a: Vec3) => (b: Vec3) =>
  ({
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z,
  })

export const multiply =
  (s: number) => (v: Vec3) =>
  ({
    x: v.x * s,
    y: v.y * s,
    z: v.z * s
  })

export const negate =
  multiply(-1)

export const lengthSquared =
  ({ x, y, z }: Vec3) => x*x + y*y + z*z

export const length =
  compose(Math.sqrt, lengthSquared)

