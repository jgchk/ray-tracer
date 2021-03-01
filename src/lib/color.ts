import * as V from './vec3.ts'

export const write =
  (color: V.Vec3) =>
  {
    const x = Math.floor(color.x * 255.999)
    const y = Math.floor(color.y * 255.999)
    const z = Math.floor(color.z * 255.999)
    console.log(`${x} ${y} ${z}`)
  }