use crate::utils::clamp;
use crate::Vec3;

pub fn write_color(color: &Vec3, samples_per_pixel: i32) {
    let scale = 1.0 / (samples_per_pixel as f64);
    let r = color.0 * scale;
    let g = color.1 * scale;
    let b = color.2 * scale;

    let ir = (256.0 * clamp(r, 0.0, 0.999)) as i32;
    let ig = (256.0 * clamp(g, 0.0, 0.999)) as i32;
    let ib = (256.0 * clamp(b, 0.0, 0.999)) as i32;

    println!("{} {} {}", ir, ig, ib);
}
