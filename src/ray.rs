use crate::Vec3;

pub struct Ray<'a, 'b> {
    pub origin: &'a Vec3,
    pub direction: &'b Vec3,
}

impl Ray<'_, '_> {
    fn at(&self, t: f64) -> Vec3 {
        self.origin + &(self.direction * t)
    }
}
