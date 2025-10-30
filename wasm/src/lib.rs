use wasm_bindgen::prelude::*;

// Particle System
#[wasm_bindgen]
pub struct ParticleSystem {
    particles: Vec<Particle>,
    width: f64,
    height: f64,
}

struct Particle {
    x: f64,
    y: f64,
    vx: f64,
    vy: f64,
    size: f64,
    hue: f64,
}

#[wasm_bindgen]
impl ParticleSystem {
    #[wasm_bindgen(constructor)]
    pub fn new(width: f64, height: f64, count: usize) -> ParticleSystem {
        let mut particles = Vec::with_capacity(count);
        
        for i in 0..count {
            let angle = (i as f64 / count as f64) * std::f64::consts::PI * 2.0;
            particles.push(Particle {
                x: width / 2.0,
                y: height / 2.0,
                vx: angle.cos() * 2.0,
                vy: angle.sin() * 2.0,
                size: 2.0 + (i % 5) as f64,
                hue: (i as f64 / count as f64) * 360.0,
            });
        }
        
        ParticleSystem { particles, width, height }
    }
    
    pub fn update(&mut self, delta: f64) {
        for particle in &mut self.particles {
            // Update position
            particle.x += particle.vx * delta;
            particle.y += particle.vy * delta;
            
            // Bounce off walls
            if particle.x < 0.0 || particle.x > self.width {
                particle.vx *= -0.95;
                particle.x = particle.x.clamp(0.0, self.width);
            }
            if particle.y < 0.0 || particle.y > self.height {
                particle.vy *= -0.95;
                particle.y = particle.y.clamp(0.0, self.height);
            }
            
            // Gravity
            particle.vy += 0.5 * delta;
            
            // Update hue
            particle.hue = (particle.hue + 0.5 * delta) % 360.0;
        }
    }
    
    pub fn get_data(&self) -> Vec<f64> {
        let mut data = Vec::with_capacity(self.particles.len() * 4);
        for particle in &self.particles {
            data.push(particle.x);
            data.push(particle.y);
            data.push(particle.size);
            data.push(particle.hue);
        }
        data
    }
}

// Mandelbrot Set
#[wasm_bindgen]
pub fn mandelbrot(
    width: usize,
    height: usize,
    x_min: f64,
    x_max: f64,
    y_min: f64,
    y_max: f64,
    max_iter: usize,
) -> Vec<u8> {
    let mut data = vec![0u8; width * height * 4];
    
    for py in 0..height {
        for px in 0..width {
            let x0 = x_min + (x_max - x_min) * px as f64 / width as f64;
            let y0 = y_min + (y_max - y_min) * py as f64 / height as f64;
            
            let mut x = 0.0;
            let mut y = 0.0;
            let mut iteration = 0;
            
            while x * x + y * y <= 4.0 && iteration < max_iter {
                let xtemp = x * x - y * y + x0;
                y = 2.0 * x * y + y0;
                x = xtemp;
                iteration += 1;
            }
            
            let idx = (py * width + px) * 4;
            if iteration == max_iter {
                data[idx] = 0;
                data[idx + 1] = 0;
                data[idx + 2] = 0;
            } else {
                let ratio = iteration as f64 / max_iter as f64;
                let hue = ratio * 360.0;
                let (r, g, b) = hsl_to_rgb(hue, 0.8, 0.5);
                data[idx] = r;
                data[idx + 1] = g;
                data[idx + 2] = b;
            }
            data[idx + 3] = 255;
        }
    }
    
    data
}

// Game of Life
#[wasm_bindgen]
pub struct GameOfLife {
    width: usize,
    height: usize,
    cells: Vec<bool>,
    next_cells: Vec<bool>,
}

#[wasm_bindgen]
impl GameOfLife {
    #[wasm_bindgen(constructor)]
    pub fn new(width: usize, height: usize) -> GameOfLife {
        let size = width * height;
        let mut cells = vec![false; size];
        
        // Create a random pattern
        for i in 0..size {
            cells[i] = (i * 7919) % 3 == 0;
        }
        
        let next_cells = cells.clone();
        
        GameOfLife {
            width,
            height,
            cells,
            next_cells,
        }
    }
    
    pub fn step(&mut self) {
        for y in 0..self.height {
            for x in 0..self.width {
                let idx = y * self.width + x;
                let alive = self.cells[idx];
                let neighbors = self.count_neighbors(x, y);
                
                self.next_cells[idx] = match (alive, neighbors) {
                    (true, 2) | (true, 3) => true,
                    (false, 3) => true,
                    _ => false,
                };
            }
        }
        
        std::mem::swap(&mut self.cells, &mut self.next_cells);
    }
    
    fn count_neighbors(&self, x: usize, y: usize) -> usize {
        let mut count = 0;
        
        for dy in [self.height - 1, 0, 1].iter() {
            for dx in [self.width - 1, 0, 1].iter() {
                if *dx == 0 && *dy == 0 {
                    continue;
                }
                
                let nx = (x + dx) % self.width;
                let ny = (y + dy) % self.height;
                
                if self.cells[ny * self.width + nx] {
                    count += 1;
                }
            }
        }
        
        count
    }
    
    pub fn get_cells(&self) -> Vec<u8> {
        let mut data = vec![0u8; self.width * self.height * 4];
        
        for i in 0..self.cells.len() {
            let idx = i * 4;
            let val = if self.cells[i] { 255 } else { 0 };
            data[idx] = val;
            data[idx + 1] = val;
            data[idx + 2] = val;
            data[idx + 3] = 255;
        }
        
        data
    }
    
    pub fn toggle_cell(&mut self, x: usize, y: usize) {
        if x < self.width && y < self.height {
            let idx = y * self.width + x;
            self.cells[idx] = !self.cells[idx];
        }
    }
    
    pub fn clear(&mut self) {
        for cell in &mut self.cells {
            *cell = false;
        }
    }
    
    pub fn randomize(&mut self) {
        for i in 0..self.cells.len() {
            self.cells[i] = (i * 7919) % 3 == 0;
        }
    }
}

// Simple Ray Tracer
#[wasm_bindgen]
pub fn raytrace(width: usize, height: usize, time: f64) -> Vec<u8> {
    let mut data = vec![0u8; width * height * 4];
    
    let sphere_x = (time * 0.5).cos() * 2.0;
    let sphere_y = (time * 0.3).sin() * 1.5;
    let sphere_z = 10.0;
    let sphere_radius = 2.0;
    
    for py in 0..height {
        for px in 0..width {
            let x = (px as f64 / width as f64 - 0.5) * 2.0;
            let y = -(py as f64 / height as f64 - 0.5) * 2.0;
            
            let ray_dx = x;
            let ray_dy = y;
            let ray_dz = 1.0;
            
            let to_sphere_x = sphere_x;
            let to_sphere_y = sphere_y;
            let to_sphere_z = sphere_z;
            
            let a = ray_dx * ray_dx + ray_dy * ray_dy + ray_dz * ray_dz;
            let b = -2.0 * (ray_dx * to_sphere_x + ray_dy * to_sphere_y + ray_dz * to_sphere_z);
            let c = to_sphere_x * to_sphere_x + to_sphere_y * to_sphere_y + to_sphere_z * to_sphere_z - sphere_radius * sphere_radius;
            
            let discriminant = b * b - 4.0 * a * c;
            
            let idx = (py * width + px) * 4;
            
            if discriminant >= 0.0 {
                let t = (-b - discriminant.sqrt()) / (2.0 * a);
                
                if t > 0.0 {
                    let hit_x = ray_dx * t;
                    let hit_y = ray_dy * t;
                    let hit_z = ray_dz * t;
                    
                    let normal_x = (hit_x - sphere_x) / sphere_radius;
                    let normal_y = (hit_y - sphere_y) / sphere_radius;
                    let normal_z = (hit_z - sphere_z) / sphere_radius;
                    
                    let light_x = 5.0;
                    let light_y = 5.0;
                    let light_z = -5.0;
                    
                    let to_light_x = light_x - hit_x;
                    let to_light_y = light_y - hit_y;
                    let to_light_z = light_z - hit_z;
                    
                    let light_dist = (to_light_x * to_light_x + to_light_y * to_light_y + to_light_z * to_light_z).sqrt();
                    
                    let dot = (normal_x * to_light_x + normal_y * to_light_y + normal_z * to_light_z) / light_dist;
                    let brightness = dot.max(0.0);
                    
                    let hue = (time * 50.0) % 360.0;
                    let (r, g, b) = hsl_to_rgb(hue, 0.7, 0.5);
                    
                    data[idx] = (r as f64 * brightness) as u8;
                    data[idx + 1] = (g as f64 * brightness) as u8;
                    data[idx + 2] = (b as f64 * brightness) as u8;
                } else {
                    // Background
                    data[idx] = 20;
                    data[idx + 1] = 20;
                    data[idx + 2] = 30;
                }
            } else {
                // Background
                data[idx] = 20;
                data[idx + 1] = 20;
                data[idx + 2] = 30;
            }
            
            data[idx + 3] = 255;
        }
    }
    
    data
}

// Helper function to convert HSL to RGB
fn hsl_to_rgb(h: f64, s: f64, l: f64) -> (u8, u8, u8) {
    let c = (1.0 - (2.0 * l - 1.0).abs()) * s;
    let x = c * (1.0 - ((h / 60.0) % 2.0 - 1.0).abs());
    let m = l - c / 2.0;
    
    let (r, g, b) = if h < 60.0 {
        (c, x, 0.0)
    } else if h < 120.0 {
        (x, c, 0.0)
    } else if h < 180.0 {
        (0.0, c, x)
    } else if h < 240.0 {
        (0.0, x, c)
    } else if h < 300.0 {
        (x, 0.0, c)
    } else {
        (c, 0.0, x)
    };
    
    (
        ((r + m) * 255.0) as u8,
        ((g + m) * 255.0) as u8,
        ((b + m) * 255.0) as u8,
    )
}
