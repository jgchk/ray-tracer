use crate::hittable::HitRecord;
use crate::Ray;
use crate::Vec3;

pub enum Material {
    Lambertian { albedo: Vec3 },
    Metal { albedo: Vec3, fuzz: f64 },
}

impl Material {
    pub fn scatter(&self, r_in: Ray, hit: &HitRecord) -> Option<(Vec3, Ray)> {
        match self {
            Material::Lambertian { albedo } => {
                let mut scatter_direction = hit.normal + Vec3::random_unit_vector();

                // Catch degenerate scatter direction
                if scatter_direction.near_zero() {
                    scatter_direction = hit.normal
                }

                let scattered = Ray {
                    origin: hit.p,
                    direction: scatter_direction,
                };
                let attenuation = albedo;
                Some((*attenuation, scattered))
            }

            Material::Metal { albedo, fuzz } => {
                let reflected = r_in.direction.unit_vector().reflect(hit.normal);
                let scattered = Ray {
                    origin: hit.p,
                    direction: reflected + *fuzz * Vec3::random_in_unit_sphere(),
                };
                let attenuation = albedo;
                if scattered.direction.dot(hit.normal) > 0.0 {
                    Some((*attenuation, scattered))
                } else {
                    None
                }
            }
        }
    }
}
