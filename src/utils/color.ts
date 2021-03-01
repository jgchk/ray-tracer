import * as V from '../lib/vec3.ts'
import { clamp1 } from './math.ts'

export const write =
  (samples: number) => (color: V.Vec3) =>
  {
    const scale = 1 / samples
    const r = Math.floor(256 * clamp1(Math.sqrt(color.x * scale)))
    const g = Math.floor(256 * clamp1(Math.sqrt(color.y * scale)))
    const b = Math.floor(256 * clamp1(Math.sqrt(color.z * scale)))
    console.log(`${r} ${g} ${b}`)
  }