mod color;
mod vec3;

use color::write_color;
use std::io::{self, Write};
use vec3::Vec3;

fn main() {
    // Image

    const IMAGE_WIDTH: i32 = 256;
    const IMAGE_HEIGHT: i32 = 256;

    // Render

    print!("P3\n{} {}\n255\n", IMAGE_WIDTH, IMAGE_HEIGHT);

    for j in (0..IMAGE_HEIGHT).rev() {
        eprint!("\rScanlines remaining: {} ", j);
        io::stderr().flush().unwrap();
        for i in 0..IMAGE_WIDTH {
            let pixel_color = Vec3 {
                x: (i as f64) / ((IMAGE_WIDTH - 1) as f64),
                y: (j as f64) / ((IMAGE_HEIGHT - 1) as f64),
                z: 0.25,
            };
            write_color(&pixel_color);
        }
    }

    eprintln!("\nDone.")
}
