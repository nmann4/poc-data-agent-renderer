# 🦀 Rust/WASM Quick Reference

## Quick Commands

### Check Current Setup
```bash
./check-rust-setup.sh
```
Shows what's installed and what's missing.

### Install Everything (Automated)
```bash
./install-rust.sh
```
Installs Rust, WASM target, and wasm-bindgen (takes 5-15 min).

### Build WASM Manually
```bash
cd wasm && ./build.sh && cd ..
```
Compiles Rust to WASM and generates JS bindings.

### Test WASM Build
```bash
./test-wasm.sh
```
Validates the WASM build and checks file integrity.

### Complete Workflow (All-in-One)
```bash
./build-and-test.sh
```
Checks prerequisites, installs if needed, builds WASM, tests, and starts dev server.

## Step-by-Step Manual Installation

### 1. Install Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### 2. Add WebAssembly Target
```bash
rustup target add wasm32-unknown-unknown
```

### 3. Install wasm-bindgen
```bash
cargo install wasm-bindgen-cli
```

### 4. Build WASM
```bash
cd wasm
./build.sh
cd ..
```

### 5. Run the App
```bash
yarn dev
```

## Verifying the Build

### Check Rust Installation
```bash
rustc --version    # Should show: rustc 1.x.x
cargo --version    # Should show: cargo 1.x.x
```

### Check WASM Tools
```bash
wasm-bindgen --version           # Should show: wasm-bindgen 0.2.x
rustup target list | grep wasm32 # Should show: (installed)
```

### Check Built Files
```bash
ls -lh public/wasm/
```
Should contain:
- `wasm_visuals_bg.wasm` (the WASM binary, ~5-8 KB)
- `wasm_visuals.js` (JavaScript bindings)

### Check in Browser
1. Start dev server: `yarn dev`
2. Open http://localhost:5174
3. Open browser console (F12)
4. Look for WASM-related messages
5. Verify smooth 60 FPS performance

## Development Workflow

### When Editing Rust Code

```bash
# After editing wasm/src/lib.rs
cd wasm && ./build.sh && cd ..

# The dev server will auto-reload
```

### Continuous Watch Mode (Optional)

```bash
# Install cargo-watch
cargo install cargo-watch

# Terminal 1: Watch Rust changes
cd wasm && cargo watch -s "./build.sh"

# Terminal 2: Run dev server
yarn dev
```

## Troubleshooting Quick Fixes

### "command not found: cargo"
```bash
source $HOME/.cargo/env
# Or restart terminal
```

### "target 'wasm32-unknown-unknown' not found"
```bash
rustup target add wasm32-unknown-unknown
```

### Build fails with dependency errors
```bash
cd wasm
cargo clean
cargo update
./build.sh
cd ..
```

### WASM not loading in browser
```bash
# Rebuild from scratch
cd wasm
rm -rf target
./build.sh
cd ..

# Hard refresh browser (Cmd+Shift+R)
```

## Performance Benchmarks

With WASM enabled, you should see:

| Demo | JavaScript | WASM | Improvement |
|------|-----------|------|-------------|
| Particles | ~30 FPS | 60 FPS | **2x faster** |
| Mandelbrot | ~1.0s | ~0.2s | **5x faster** |
| Game of Life | 10 steps/s | 30 steps/s | **3x faster** |
| Ray Tracer | ~15 FPS | 30+ FPS | **2x faster** |

## File Structure

```
wasm/
├── Cargo.toml           # Rust package config
├── src/
│   └── lib.rs          # Rust source code
├── build.sh            # Build script
└── target/             # Build output (gitignored)
    └── wasm32-unknown-unknown/
        └── release/
            └── wasm_visuals.wasm

public/wasm/
├── wasm_visuals.js         # JS bindings (or JS fallback)
└── wasm_visuals_bg.wasm    # WASM binary (after build)
```

## Quick Test Commands

```bash
# Test Rust compilation
cd wasm && cargo check --target wasm32-unknown-unknown

# Build in release mode (optimized)
cd wasm && cargo build --target wasm32-unknown-unknown --release

# Check WASM file size
ls -lh public/wasm/wasm_visuals_bg.wasm

# Validate WASM binary
file public/wasm/wasm_visuals_bg.wasm
```

## Resources

- 📖 Full guide: `TESTING_RUST_WASM.md`
- 🦀 Rust book: https://doc.rust-lang.org/book/
- 🕸️ wasm-bindgen docs: https://rustwasm.github.io/wasm-bindgen/
- 🚀 Rust & WASM: https://rustwasm.github.io/docs/book/

## Current Status

Run `./check-rust-setup.sh` anytime to see:
- ✓ What's installed
- ✗ What's missing
- 📋 Next steps
