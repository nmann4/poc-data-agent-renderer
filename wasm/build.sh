#!/bin/bash

# Source Rust environment if it exists
[ -f "$HOME/.cargo/env" ] && source "$HOME/.cargo/env"

# Build the Rust WASM module
cargo build --target wasm32-unknown-unknown --release

# Use wasm-bindgen to generate JS bindings
wasm-bindgen target/wasm32-unknown-unknown/release/wasm_visuals.wasm \
  --out-dir ../public/wasm \
  --target web \
  --no-typescript

echo "WASM build complete! Output in public/wasm/"
