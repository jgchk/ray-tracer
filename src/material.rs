use crate::hittable::HitRecord;
use crate::random_double;
use crate::Ray;
use crate::Vec3;

pub enum Material {
    Lambertian { albedo: Vec3 },
    Metal { albedo: Vec3, fuzz: f64 },
    Dialectric { refraction_index: f64 },
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

            Material::Dialectric { refraction_index } => {
                let attenuation = Vec3(1.0, 1.0, 1.0);
                let refraction_ratio = if hit.front_face {
                    1.0 / refraction_index
                } else {
                    *refraction_index
                };

                let unit_direction = r_in.direction.unit_vector();
                let cos_theta = -unit_direction.dot(hit.normal).min(1.0);
                let sin_theta = (1.0 - cos_theta * cos_theta).sqrt();

                let cannot_refract = refraction_ratio * sin_theta > 1.0;
                let direction = if cannot_refract
                    || reflectance(cos_theta, refraction_ratio) > random_double()
                {
                    unit_direction.reflect(hit.normal)
                } else {
                    unit_direction.refract(hit.normal, refraction_ratio)
                };

                let scattered = Ray {
                    origin: hit.p,
                    direction,
                };
                Some((attenuation, scattered))
            }
        }
    }
}

fn reflectance(cosine: f64, refraction_index: f64) -> f64 {
    // Use Schlick's approximation for reflectance
    let r0 = {
        let t = (1.0 - refraction_index) / (1.0 + refraction_index);
        t * t
    };
    r0 + (1.0 - r0) * (1.0 - cosine).powi(5)
}
