import { flow } from 'https://deno.land/x/hkts@v0.0.49/fns.ts'

export type Vec3 =
  { x: number; y: number; z: number }

export const vec3 = 
  (x: number, y: number, z: number) =>
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
  flow(lengthSquared, Math.sqrt)

export const unitVector =
  (v: Vec3) =>
  divide(length(v))(v)

export const dot =
  (b: Vec3) => (a: Vec3) =>
  a.x*b.x + a.y*b.y + a.z*b.z