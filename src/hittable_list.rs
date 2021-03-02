use crate::hittable::HitRecord;
use crate::Hittable;
use crate::Ray;

pub struct HittableList<T: Hittable> {
    pub objects: Vec<T>,
}

impl<T: Hittable> Hittable for HittableList<T> {
    fn hit(&self, r: &Ray, t_min: f64, t_max: f64) -> Option<HitRecord> {
        let mut maybe_closest_hit: Option<HitRecord> = None;

        for object in self.objects.iter() {
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
