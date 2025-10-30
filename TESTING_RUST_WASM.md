# Testing Rust/WASM Components

This guide will help you install Rust, build the WASM components, and verify they work correctly.

## Prerequisites Check

Run this command to check your current setup:

```bash
./check-rust-setup.sh
```

## Step 1: Install Rust Toolchain

### macOS/Linux Installation

```bash
# Install Rust using rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Follow the prompts (typically just press Enter for defaults)

# After installation, reload your shell
source $HOME/.cargo/env

# Verify installation
rustc --version
cargo --version
```

Expected output:
```
rustc 1.x.x (or newer)
cargo 1.x.x (or newer)
```

## Step 2: Add WebAssembly Target

```bash
# Add the wasm32 target for cross-compilation
rustup target add wasm32-unknown-unknown

# Verify it was added
rustup target list | grep wasm32-unknown-unknown
```

You should see:
```
wasm32-unknown-unknown (installed)
```

## Step 3: Install wasm-bindgen-cli

```bash
# Install wasm-bindgen CLI tool
# This generates JavaScript bindings for your Rust WASM code
cargo install wasm-bindgen-cli

# This may take 5-10 minutes to compile

# Verify installation
wasm-bindgen --version
```

Expected output:
```
wasm-bindgen 0.2.x
```

## Step 4: Build the WASM Module

### Option A: Using the Build Script (Recommended)

```bash
# Navigate to the wasm directory
cd wasm

# Run the build script
./build.sh

# Return to project root
cd ..
```

### Option B: Manual Build Commands

```bash
cd wasm

# Build the Rust code to WASM
cargo build --target wasm32-unknown-unknown --release

# Generate JavaScript bindings
wasm-bindgen target/wasm32-unknown-unknown/release/wasm_visuals.wasm \
  --out-dir ../public/wasm \
  --target web \
  --no-typescript

cd ..
```

## Step 5: Verify the Build

Check that the following files were created in `public/wasm/`:

```bash
ls -lh public/wasm/
```

You should see:
- `wasm_visuals.js` - JavaScript bindings (will be REPLACED with WASM version)
- `wasm_visuals_bg.wasm` - The actual WASM binary
- `wasm_visuals_bg.wasm.d.ts` - TypeScript declarations (optional)

## Step 6: Test the WASM Build

### Quick Test Script

```bash
# Run the test script
./test-wasm.sh
```

### Manual Testing

1. **Start the development server:**
   ```bash
   yarn dev
   ```

2. **Open your browser to:** `http://localhost:5174`

3. **Open the browser console** (F12 or Cmd+Option+I)

4. **Look for WASM loading messages:**
   - The app should load without errors
   - You should NOT see "Failed to load WASM" errors
   - Demos should run smoothly

### Performance Comparison

To verify WASM is being used vs JavaScript fallback:

1. **Add console logging** to the components (temporarily):
   ```typescript
   console.log('WASM module loaded:', wasm.constructor.name);
   ```

2. **Check FPS**: With WASM, you should see:
   - Particle System: 60 FPS consistently
   - Mandelbrot: Renders in ~0.2 seconds
   - Game of Life: 30+ steps per second

## Troubleshooting

### Build Errors

**Error: `cargo: command not found`**
- Rust is not installed or not in PATH
- Run: `source $HOME/.cargo/env`
- Or restart your terminal

**Error: `error: no default toolchain configured`**
- Rustup didn't complete installation
- Run: `rustup default stable`

**Error: `can't find crate for 'wasm_bindgen'`**
- Dependencies not downloaded
- Run: `cd wasm && cargo update && cd ..`

**Error: `wasm-bindgen: command not found`**
- CLI tool not installed
- Run: `cargo install wasm-bindgen-cli`
- Make sure `~/.cargo/bin` is in your PATH

**Error: `target 'wasm32-unknown-unknown' not found`**
- WebAssembly target not installed
- Run: `rustup target add wasm32-unknown-unknown`

### Runtime Errors

**Browser console shows "Failed to load WASM"**
- Build didn't complete successfully
- Check that `public/wasm/wasm_visuals_bg.wasm` exists
- Rebuild: `cd wasm && ./build.sh && cd ..`

**Demos are slow/laggy with WASM**
- WASM might not have compiled in release mode
- Ensure `--release` flag is used in build
- Check `wasm/Cargo.toml` has optimizations enabled

**TypeScript errors about WASM module**
- Type declarations may need updating
- The app should still run - TypeScript errors won't affect runtime
- JS fallback types are already configured

## Build Optimization

The `Cargo.toml` is already configured for maximum performance:

```toml
[profile.release]
opt-level = 3        # Maximum optimization
lto = true          # Link-time optimization
```

For even smaller WASM files, you can add:

```toml
[profile.release]
opt-level = "z"     # Optimize for size
lto = true
strip = true        # Strip debug symbols
```

## Continuous Development

### Watch Mode for Rust

If you're actively developing the Rust code:

```bash
# Install cargo-watch
cargo install cargo-watch

# Auto-rebuild on changes
cd wasm
cargo watch -x "build --target wasm32-unknown-unknown --release" -s "./build.sh"
```

### Integration with Vite

The current setup requires manual WASM rebuilds. To auto-rebuild:

```bash
# In one terminal: Watch Rust
cd wasm && cargo watch -s "./build.sh"

# In another terminal: Run Vite
yarn dev
```

## File Size Comparison

After building, check the sizes:

```bash
# JavaScript fallback
ls -lh public/wasm/wasm_visuals.js

# WASM binary
ls -lh public/wasm/wasm_visuals_bg.wasm
```

Typical sizes:
- JavaScript: ~10-15 KB
- WASM: ~5-8 KB (smaller and faster!)

## Benchmarking

To measure actual performance improvements:

1. **Enable performance marks in components:**
   ```typescript
   performance.mark('start');
   // ... computation ...
   performance.mark('end');
   performance.measure('computation', 'start', 'end');
   console.log(performance.getEntriesByName('computation')[0].duration);
   ```

2. **Compare JS vs WASM:**
   - Switch `public/wasm/wasm_visuals.js` between JS and WASM versions
   - Run the same demo
   - Compare execution times

## Success Checklist

✅ Rust installed (`rustc --version`)
✅ Cargo installed (`cargo --version`)
✅ wasm32 target added (`rustup target list | grep wasm32`)
✅ wasm-bindgen installed (`wasm-bindgen --version`)
✅ Build completes without errors (`./wasm/build.sh`)
✅ WASM files created in `public/wasm/`
✅ App runs in browser (`yarn dev`)
✅ No WASM errors in console
✅ Smooth 60 FPS performance

## Next Steps

Once WASM is working:
- Experiment with the Rust code in `wasm/src/lib.rs`
- Add new visual effects
- Optimize algorithms
- Compare performance with JS fallback

Happy coding! 🦀🚀
