# WebAssembly Visual Demos

A showcase of high-performance visual effects powered by Rust + WebAssembly.

Originally a POC for testing remote file renderer plugins in the Data Agent, now transformed into an interactive demo of WebAssembly graphics capabilities.

## 🎨 Demos Included

1. **Particle System** - Physics-based particle simulation with 500+ particles
2. **Ray Tracer** - Real-time 3D sphere rendering with lighting
3. **Mandelbrot Set** - Interactive fractal explorer with zoom
4. **Game of Life** - Conway's cellular automaton on a 200x150 grid

## 🚀 Quick Start

### Using JavaScript Fallback (No Rust Required)

The project includes JavaScript implementations that work immediately:

```bash
# Install dependencies
yarn install

# Start development server
yarn dev
```

### Building with WebAssembly (Optional - Requires Rust)

For maximum performance with WASM:

```bash
# Install Rust and wasm-pack
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install wasm-pack

# Add wasm target
rustup target add wasm32-unknown-unknown

# Install wasm-bindgen-cli
cargo install wasm-bindgen-cli

# Build WASM module
cd wasm
chmod +x build.sh
./build.sh
cd ..

# Start development
yarn dev
```

## 📦 Building for Production

```bash
# Build the project
yarn build

# Preview production build
yarn preview
```

## 🌐 Deploy to GitHub Pages

The project is configured for automatic deployment to GitHub Pages:

1. Push to the `main` branch
2. GitHub Actions will automatically build and deploy
3. Your site will be live at: `https://[username].github.io/poc-data-agent-renderer/`

## 🛠️ Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Graphics**: WebAssembly (Rust) / JavaScript fallback
- **Deployment**: GitHub Pages via GitHub Actions

## 📝 Project Structure

```
├── src/
│   ├── components/          # Demo components
│   │   ├── ParticleSystemDemo.tsx
│   │   ├── RayTraceDemo.tsx
│   │   ├── MandelbrotDemo.tsx
│   │   └── GameOfLifeDemo.tsx
│   ├── types/              # TypeScript definitions
│   └── App.tsx             # Main application
├── wasm/                   # Rust WASM source
│   ├── src/lib.rs
│   ├── Cargo.toml
│   └── build.sh
└── public/                 # Static assets
```

## 🎮 Controls

### Mandelbrot Set
- Click to zoom in
- Use slider to adjust iteration count
- Reset button to return to initial view

### Game of Life
- Click cells to toggle them
- Play/Pause button to control simulation
- Speed slider to adjust simulation speed
- Clear and Randomize buttons

## ⚡ Performance

The WASM implementations provide significant performance improvements:
- **Particle System**: 60 FPS with 500+ particles
- **Mandelbrot**: Real-time rendering with high iteration counts
- **Game of Life**: 30+ generations per second on 200x150 grid
- **Ray Tracer**: Smooth real-time 3D rendering

## 📄 License

MIT
