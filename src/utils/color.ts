import * as V from '../lib/vec3.ts'
import { clamp1 } from './math.ts'

export const write =
  (samples: number) => (color: V.Vec3) =>
  {
    const scale = 1 / samples
    const r = Math.floor(256 * clamp1(color.x * scale))
    const g = Math.floor(256 * clamp1(color.y * scale))
    const b = Math.floor(256 * clamp1(color.z * scale))
    console.log(`${r} ${g} ${b}`)
  }