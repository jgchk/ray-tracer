use crate::material::Material;
use crate::Ray;
use crate::Vec3;

pub struct HitRecord<'a> {
    pub p: Vec3,
    pub normal: Vec3,
    pub material: &'a Material,
    pub t: f64,
    pub front_face: bool,
}

pub enum Hittable<'a> {
    Sphere {
        center: Vec3,
        radius: f64,
        material: &'a Material,
    },
    HittableList {
        objects: Vec<Hittable<'a>>,
    },
}

impl Hittable<'_> {
    pub fn hit(&self, r: Ray, t_min: f64, t_max: f64) -> Option<HitRecord> {
        match self {
            Hittable::Sphere {
                center,
                radius,
                material,
            } => {
                let oc = r.origin - *center;
                let a = r.direction.length_squared();
                let half_b = oc.dot(r.direction);
                let c = oc.length_squared() - radius * radius;
                let discriminant = half_b * half_b - a * c;
                if discriminant < 0.0 {
                    return None;
                }
                let sqrtd = discriminant.sqrt();
                // Find the nearest root that lies in the acceptable range
                let mut root = (-half_b - sqrtd) / a;
                if root < t_min || t_max < root {
                    root = (-half_b + sqrtd) / a;
                    if root < t_min || t_max < root {
                        return None;
                    }
                }
                let t = root;
                let p = r.at(t);
                let outward_normal = (p - *center) / *radius;
                let front_face = r.direction.dot(outward_normal) < 0.0;
                let normal = if front_face {
                    outward_normal
                } else {
                    -outward_normal
                };
                Some(HitRecord {
                    t,
                    p,
                    normal,
                    front_face,
                    material,
                })
            }

            Hittable::HittableList { objects } => {
                let mut maybe_closest_hit: Option<HitRecord> = None;

                for object in objects.iter() {
                    let current_t_max = match maybe_closest_hit {
                        Some(ref closest_hit) => closest_hit.t,
                        None => t_max,
                    };
                    let hit = object.hit(r, t_min, current_t_max);
                    if hit.is_some() {
                        maybe_closest_hit = hit
                    }
                }
                maybe_closest_hit
            }
        }
    }
}
