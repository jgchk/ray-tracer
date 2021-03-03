mod camera;
mod color;
mod hittable;
mod hittable_list;
mod ray;
mod sphere;
mod utils;
mod vec3;

use crate::camera::Camera;
use crate::color::write_color;
use crate::hittable::Hittable;
use crate::hittable_list::HittableList;
use crate::ray::Ray;
use crate::sphere::Sphere;
use crate::utils::random_double;
use crate::vec3::Vec3;
use std::f64::INFINITY;
use std::io::{self, Write};

fn ray_color<T: Hittable>(r: &Ray, world: &T, depth: i32) -> Vec3 {
    if depth <= 0 {
        return Vec3::origin();
    }

    match world.hit(r, 0.001, INFINITY) {
        Some(hit) => {
            let target = hit.p + hit.normal + Vec3::random_unit_vector();
            0.5 * ray_color(
                &Ray {
                    origin: hit.p,
                    direction: target - hit.p,
                },
                world,
                depth - 1,
            )
        }
        None => {
            let unit_direction = r.direction.unit_vector();
            let t = 0.5 * (unit_direction.1 + 1.0);
            (1.0 - t) * Vec3(1.0, 1.0, 1.0) + t * Vec3(0.5, 0.7, 1.0)
        }
    }
}

fn main() {
    // Image

    const ASPECT_RATIO: f64 = 16.0 / 9.0;
    const IMAGE_WIDTH: i32 = 400;
    const IMAGE_HEIGHT: i32 = ((IMAGE_WIDTH as f64) / ASPECT_RATIO) as i32;
    const SAMPLES_PER_PIXEL: i32 = 100;
    const MAX_DEPTH: i32 = 50;

    // World

    let world = HittableList {
        objects: vec![
            Sphere {
                center: Vec3(0.0, 0.0, -1.0),
                radius: 0.5,
            },
            Sphere {
                center: Vec3(0.0, -100.5, -1.0),
                radius: 100.0,
            },
        ],
    };

    // Camera

    let cam = Camera::new();

    // Render

    print!("P3\n{} {}\n255\n", IMAGE_WIDTH, IMAGE_HEIGHT);

    for j in (0..IMAGE_HEIGHT).rev() {
        eprint!("\rScanlines remaining: {} ", j);
        io::stderr().flush().unwrap();
        for i in 0..IMAGE_WIDTH {
            let mut pixel_color = Vec3::origin();
            for _ in 0..SAMPLES_PER_PIXEL {
                let u = ((i as f64) + random_double()) / ((IMAGE_WIDTH - 1) as f64);
                let v = ((j as f64) + random_double()) / ((IMAGE_HEIGHT - 1) as f64);
                let r = cam.get_ray(u, v);
                pixel_color = pixel_color + ray_color(&r, &world, MAX_DEPTH);
            }
            write_color(&pixel_color, SAMPLES_PER_PIXEL);
        }
    }

    eprintln!("\nDone.")
}
