import { compose, pipeline } from 'https://deno.land/x/compose@1.3.2/index.js'

export type Vec3 =
  { x: number; y: number; z: number }

export const vec3 = 
  (x: number) => (y: number) => (z: number) =>
  ({ x, y, z })

export const multiply =
  (s: number) => (v: Vec3) =>
  ({
    x: v.x * s,
    y: v.y * s,
    z: v.z * s
  })

export const divide =
  (s: number) =>
  multiply(1 / s)

export const negate =
  multiply(-1)

export const add =
  (b: Vec3) => (a: Vec3) =>
  ({
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z,
  })

export const subtract =
  (b: Vec3) => (a: Vec3) =>
  add(a)(negate(b))

export const lengthSquared =
  ({ x, y, z }: Vec3) => x*x + y*y + z*z

export const length =
  compose(Math.sqrt, lengthSquared)

export const unitVector =
  (v: Vec3) =>
  divide(length(v))(v)

export const dot =
  (b: Vec3) => (a: Vec3) =>
  a.x*b.x + a.y*b.y + a.z*b.z