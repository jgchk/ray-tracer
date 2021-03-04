mod camera;
mod color;
mod hittable;
mod material;
mod ray;
mod utils;
mod vec3;

use crate::camera::Camera;
use crate::color::process_color;
use crate::hittable::Hittable;
use crate::material::Material::{Dialectric, Lambertian, Metal};
use crate::ray::Ray;
use crate::utils::random_double;
use crate::utils::random_range;
use crate::vec3::Vec3;
use crate::Hittable::{HittableList, Sphere};
use rayon::prelude::*;
use std::f64::INFINITY;
use std::fs::File;
use std::io::BufWriter;
use std::io::{self, Write};
use std::path::Path;

fn random_scene() -> Hittable {
    let mut objects: Vec<Hittable> = Vec::new();

    let ground_material = Lambertian {
        albedo: Vec3(0.5, 0.5, 0.5),
    };
    objects.push(Sphere {
        center: Vec3(0.0, -1000.0, 0.0),
        radius: 1000.0,
        material: ground_material,
    });

    for a in -11..11 {
        for b in -11..11 {
            let choose_mat = random_double();
            let center = Vec3(
                (a as f64) + 0.9 * random_double(),
                0.2,
                (b as f64) + 0.9 * random_double(),
            );

            if (center - Vec3(4.0, 0.2, 0.0)).length() > 0.9 {
                if choose_mat < 0.8 {
                    // diffuse
                    let albedo = Vec3::random() * Vec3::random();
                    let sphere_material = Lambertian { albedo };
                    objects.push(Sphere {
                        center,
                        radius: 0.2,
                        material: sphere_material,
                    });
                } else if choose_mat < 0.95 {
                    // metal
                    let albedo = Vec3::random_range(0.5, 1.0);
                    let fuzz = random_range(0.0, 0.5);
                    let sphere_material = Metal { albedo, fuzz };
                    objects.push(Sphere {
                        center,
                        radius: 0.2,
                        material: sphere_material,
                    });
                } else {
                    // glass
                    let sphere_material = Dialectric {
                        refraction_index: 1.5,
                    };
                    objects.push(Sphere {
                        center,
                        radius: 0.2,
                        material: sphere_material,
                    })
                }
            }
        }
    }

    let material1 = Dialectric {
        refraction_index: 1.5,
    };
    objects.push(Sphere {
        center: Vec3(0.0, 1.0, 0.0),
        radius: 1.0,
        material: material1,
    });

    let material2 = Lambertian {
        albedo: Vec3(0.4, 0.2, 0.1),
    };
    objects.push(Sphere {
        center: Vec3(-4.0, 1.0, 0.0),
        radius: 1.0,
        material: material2,
    });

    let material3 = Metal {
        albedo: Vec3(0.7, 0.6, 0.5),
        fuzz: 0.0,
    };
    objects.push(Sphere {
        center: Vec3(4.0, 1.0, 0.0),
        radius: 1.0,
        material: material3,
    });

    HittableList { objects }
}

fn ray_color(r: Ray, world: &Hittable, depth: i32) -> Vec3 {
    if depth <= 0 {
        return Vec3::origin();
    }

    match world.hit(r, 0.001, INFINITY) {
        Some(hit) => match hit.material.scatter(r, &hit) {
            Some((attenuation, scattered)) => attenuation * ray_color(scattered, world, depth - 1),
            None => Vec3::origin(),
        },
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
    const IMAGE_WIDTH: i32 = 1200;
    const IMAGE_HEIGHT: i32 = ((IMAGE_WIDTH as f64) / ASPECT_RATIO) as i32;
    const SAMPLES_PER_PIXEL: i32 = 500;
    const MAX_DEPTH: i32 = 50;

    // World

    let world = random_scene();

    // Camera

    let look_from = Vec3(13.0, 2.0, 3.0);
    let look_at = Vec3(0.0, 0.0, 0.0);
    let v_up = Vec3(0.0, 1.0, 0.0);
    let dist_to_focus = 10.0;
    let aperture = 0.1;
    let cam = Camera::new(
        look_from,
        look_at,
        v_up,
        20.0,
        ASPECT_RATIO,
        aperture,
        dist_to_focus,
    );

    // Render

    print!("P3\n{} {}\n255\n", IMAGE_WIDTH, IMAGE_HEIGHT);

    let mut pixels: Vec<u8> = Vec::new();

    for j in (0..IMAGE_HEIGHT).rev() {
        eprint!("\rScanlines remaining: {} ", j);
        io::stderr().flush().unwrap();
        for i in 0..IMAGE_WIDTH {
            let pixel_color = (0..SAMPLES_PER_PIXEL)
                .into_par_iter()
                .map(|_| {
                    let u = ((i as f64) + random_double()) / ((IMAGE_WIDTH - 1) as f64);
                    let v = ((j as f64) + random_double()) / ((IMAGE_HEIGHT - 1) as f64);
                    let r = cam.get_ray(u, v);
                    ray_color(r, &world, MAX_DEPTH)
                })
                .sum();
            let pixel = process_color(pixel_color, SAMPLES_PER_PIXEL);
            pixels.extend(&pixel);
        }
    }

    let path = Path::new(r"image.png");
    let file = File::create(path).unwrap();
    let ref mut w = BufWriter::new(file);

    let mut encoder = png::Encoder::new(w, IMAGE_WIDTH as u32, IMAGE_HEIGHT as u32);
    encoder.set_color(png::ColorType::RGB);
    encoder.set_depth(png::BitDepth::Eight);

    let mut writer = encoder.write_header().unwrap();
    writer.write_image_data(&pixels).unwrap();

    eprintln!("\nDone.")
}
