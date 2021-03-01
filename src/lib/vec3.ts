import { pipe, flow } from 'https://deno.land/x/hkts@v0.0.49/fns.ts'
import * as R from '../utils/random.ts'

export type Vec3 =
  { x: number; y: number; z: number }



// Constructors

export const vec3 = 
  (x: number, y: number, z: number) =>
  ({ x, y, z })

export const random =
  () =>
  vec3(R.random(), R.random(), R.random())

export const randomRange =
  (min: number) => (max: number) =>
  vec3(R.randomRange(min)(max), R.randomRange(min)(max), R.randomRange(min)(max))

export const randomInUnitSphere =
  () =>
  {
    while (true) {
      const p = randomRange(-1)(1)
      if (lengthSquared(p) < 1)
        return p
    }
  }

export const randomInUnitDisk =
  () => 
  {
    while (true) {
      const p = vec3(R.randomRange(-1)(1), R.randomRange(-1)(1), 0)
      if (lengthSquared(p) < 1)
        return p
    }
  }

export const randomUnitVector =
  () =>
  unitVector(randomInUnitSphere())




// Properties

export const lengthSquared =
  ({ x, y, z }: Vec3) => x*x + y*y + z*z

export const length =
  flow(lengthSquared, Math.sqrt)

export const nearZero =
  ({ x, y, z }: Vec3) =>
  {
    const s = 1e-8
    return (Math.abs(x) < s) && (Math.abs(y) < s) && (Math.abs(z) < s)
  }



// Operations

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

export const unitVector =
  (v: Vec3) =>
  divide(length(v))(v)

export const dot =
  (v: Vec3) => (u: Vec3) =>
  u.x*v.x + u.y*v.y + u.z*v.z

export const cross =
  (v: Vec3) => (u: Vec3) =>
  ({
    x: u.y * v.z - u.z * v.y,
    y: u.z * v.x - u.x * v.z,
    z: u.x * v.y - u.y * v.x
  })

export const attenuate =
  (attenuation: Vec3) => (v: Vec3) =>
  ({
    x: attenuation.x * v.x,
    y: attenuation.y * v.y,
    z: attenuation.z * v.z
  })

export const reflect =
  (n: Vec3) => (v: Vec3) =>
  pipe(
    v,
    subtract(
      pipe(
        n,
        multiply(2 * dot(v)(n))
      )
    )
  )

export const refract =
  (uv: Vec3) => (n: Vec3) => (etaiOverEtat: number) =>
  {
    const cosTheta = Math.min(dot(negate(uv))(n), 1)
    const rOutPerp = multiply(etaiOverEtat)(add(uv)(multiply(cosTheta)(n)))
    const rOutParallel = multiply(-Math.sqrt(Math.abs(1 - lengthSquared(rOutPerp))))(n)
    return add(rOutPerp)(rOutParallel)
  }