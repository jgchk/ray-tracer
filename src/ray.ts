import * as V from './vec3.ts'

export type Ray = { origin: V.Vec3; direction: V.Vec3 }

export const ray =
  (origin: V.Vec3) => (direction: V.Vec3) =>
  ({ origin, direction })

export const at =
  (t: number) => ({ origin, direction }: Ray) =>
  V.add(origin)(V.multiply(t)(direction))