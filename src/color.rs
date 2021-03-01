use super::vec3::Vec3;

pub fn write_color(color: &Vec3) {
    // Write the translated [0,255] value of each color component
    let r = (255.999 * color.x) as i32;
    let g = (255.999 * color.y) as i32;
    let b = (255.999 * color.z) as i32;
    println!("{} {} {}", r, g, b);
}
