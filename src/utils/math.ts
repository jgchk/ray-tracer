export const clamp =
  (min: number) => (max: number) => (x: number) =>
  x < min ? min : (x > max ? max : x)

export const degreesToRadians =
  (degrees: number) =>
  degrees * Math.PI / 180