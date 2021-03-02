mod color;
mod hittable;
mod hittable_list;
mod ray;
mod sphere;
mod vec3;

use crate::color::write_color;
use crate::hittable::Hittable;
use crate::hittable_list::HittableList;
use crate::ray::Ray;
use crate::sphere::Sphere;
use crate::vec3::Vec3;
use std::f64::INFINITY;
use std::io::{self, Write};

fn ray_color<T: Hittable>(r: &Ray, world: &T) -> Vec3 {
    match world.hit(r, 0.0, INFINITY) {
        Some(hit) => {
            0.5 * (hit.normal
                + Vec3 {
                    x: 1.0,
                    y: 1.0,
                    z: 1.0,
                })
        }
        None => {
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
    }
}

fn main() {
    // Image

    const ASPECT_RATIO: f64 = 16.0 / 9.0;
    const IMAGE_WIDTH: i32 = 400;
    const IMAGE_HEIGHT: i32 = ((IMAGE_WIDTH as f64) / ASPECT_RATIO) as i32;

    // World

    let world = HittableList {
        objects: vec![
            Sphere {
                center: Vec3 {
                    x: 0.0,
                    y: 0.0,
                    z: -1.0,
                },
                radius: 0.5,
            },
            Sphere {
                center: Vec3 {
                    x: 0.0,
                    y: -100.5,
                    z: -1.0,
                },
                radius: 100.0,
            },
        ],
    };

    // Camera

    let viewport_height = 2.0;
    let viewport_width = ASPECT_RATIO * viewport_height;
    let focal_length = 1.0;

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
    let lower_left_corner = Vec3::origin()
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
            let direction = &lower_left_corner + &horizontal * u + &vertical * v - Vec3::origin();
            let r = Ray {
                origin: Vec3::origin(),
                direction,
            };
            let pixel_color = ray_color(&r, &world);
            write_color(&pixel_color);
        }
    }

    eprintln!("\nDone.")
}
