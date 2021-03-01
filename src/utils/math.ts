export const clamp =
  (min: number) => (max: number) => (x: number) =>
  x < min ? min : (x > max ? max : x)

export const clamp1 =
  clamp(0)(0.999)