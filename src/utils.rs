use rand::prelude::*;
use std::f64::consts::PI;

pub fn random_double() -> f64 {
    random()
}

pub fn random_range(min: f64, max: f64) -> f64 {
    // Returns a random real in [min,max)
    min + (max - min) * random_double()
}

pub fn clamp(input: f64, min: f64, max: f64) -> f64 {
    if input < min {
        min
    } else if input > max {
        max
    } else {
        input
    }
}

pub fn degrees_to_radians(degrees: f64) -> f64 {
    degrees * PI / 180.0
}
