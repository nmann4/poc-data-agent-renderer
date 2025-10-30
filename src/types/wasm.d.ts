declare module '*/wasm_visuals.js' {
  export default function init(): Promise<void>;
  
  export class ParticleSystem {
    constructor(width: number, height: number, count: number);
    update(delta: number): void;
    get_data(): Float64Array;
  }
  
  export class GameOfLife {
    constructor(width: number, height: number);
    step(): void;
    get_cells(): Uint8Array;
    toggle_cell(x: number, y: number): void;
    clear(): void;
    randomize(): void;
  }
  
  export function mandelbrot(
    width: number,
    height: number,
    x_min: number,
    x_max: number,
    y_min: number,
    y_max: number,
    max_iter: number
  ): Uint8Array;
  
  export function raytrace(
    width: number,
    height: number,
    time: number
  ): Uint8Array;
}
