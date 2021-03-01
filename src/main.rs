mod color;
mod ray;
mod vec3;

use crate::color::write_color;
use crate::ray::Ray;
use crate::vec3::Vec3;
use std::io::{self, Write};

fn ray_color(r: &Ray) -> Vec3 {
    let unit_direction = r.direction.unit_vector();
    let t = 0.5 * (unit_direction.y + 1.0);
    (1.0 - t)
        * Vec3 {
            x: 1.0,
            y: 1.0,
            z: 1.0,
        }
        + t * Vec3 {
            x: 0.5,
            y: 0.7,
            z: 1.0,
        }
}

fn main() {
    // Image

    const ASPECT_RATIO: f64 = 16.0 / 9.0;
    const IMAGE_WIDTH: i32 = 256;
    const IMAGE_HEIGHT: i32 = 256;

    // Camera

    let viewport_height = 2.0;
    let viewport_width = ASPECT_RATIO * viewport_height;
    let focal_length = 1.0;

    let origin = Vec3 {
        x: 0.0,
        y: 0.0,
        z: 0.0,
    };
    let horizontal = Vec3 {
        x: viewport_width,
        y: 0.0,
        z: 0.0,
    };
    let vertical = Vec3 {
        x: 0.0,
        y: viewport_height,
        z: 0.0,
    };
    let lower_left_corner = &origin
        - &horizontal / 2.0
        - &vertical / 2.0
        - Vec3 {
            x: 0.0,
            y: 0.0,
            z: focal_length,
        };

    // Render

    print!("P3\n{} {}\n255\n", IMAGE_WIDTH, IMAGE_HEIGHT);

    for j in (0..IMAGE_HEIGHT).rev() {
        eprint!("\rScanlines remaining: {} ", j);
        io::stderr().flush().unwrap();
        for i in 0..IMAGE_WIDTH {
            let u = (i as f64) / ((IMAGE_WIDTH - 1) as f64);
            let v = (j as f64) / ((IMAGE_HEIGHT - 1) as f64);
            let r = Ray {
                origin: &origin,
                direction: &(&lower_left_corner + &horizontal * u + &vertical * v - &origin),
            };
            let pixel_color = ray_color(&r);
            write_color(&pixel_color);
        }
    }

    eprintln!("\nDone.")
}
