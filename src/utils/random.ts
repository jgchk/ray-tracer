export const random =
  Math.random

export const randomRange =
  (min: number) => (max: number) =>
  min + (max-min)*random()