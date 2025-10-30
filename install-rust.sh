#!/bin/bash

echo "🦀 Rust/WASM Installation Script"
echo "================================="
echo ""
echo "This script will install everything needed to build WASM:"
echo "  1. Rust toolchain (rustc + cargo)"
echo "  2. WebAssembly target (wasm32-unknown-unknown)"
echo "  3. wasm-bindgen CLI tool"
echo ""
echo "⚠️  This will take about 5-15 minutes depending on your internet speed"
echo ""

read -p "Continue with installation? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Installation cancelled."
    exit 1
fi

echo ""
echo "Step 1/3: Installing Rust..."
echo "============================="

if command -v rustc &> /dev/null; then
    echo "✓ Rust is already installed"
    rustc --version
else
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
    
    if command -v rustc &> /dev/null; then
        echo "✓ Rust installed successfully!"
        rustc --version
    else
        echo "❌ Rust installation failed"
        echo "Please install manually: https://rustup.rs/"
        exit 1
    fi
fi

echo ""
echo "Step 2/3: Adding WebAssembly target..."
echo "======================================="

rustup target add wasm32-unknown-unknown

if rustup target list | grep -q "wasm32-unknown-unknown (installed)"; then
    echo "✓ WebAssembly target added successfully!"
else
    echo "❌ Failed to add WebAssembly target"
    exit 1
fi

echo ""
echo "Step 3/3: Installing wasm-bindgen..."
echo "====================================="
echo "(This may take 5-10 minutes to compile...)"

if command -v wasm-bindgen &> /dev/null; then
    echo "✓ wasm-bindgen is already installed"
    wasm-bindgen --version
else
    cargo install wasm-bindgen-cli
    
    if command -v wasm-bindgen &> /dev/null; then
        echo "✓ wasm-bindgen installed successfully!"
        wasm-bindgen --version
    else
        echo "❌ wasm-bindgen installation failed"
        exit 1
    fi
fi

echo ""
echo "================================="
echo "✅ Installation Complete!"
echo "================================="
echo ""
echo "All prerequisites are now installed."
echo ""
echo "Next step: Build the WASM module"
echo ""
echo "  cd wasm && ./build.sh && cd .."
echo ""
echo "Then start the dev server:"
echo ""
echo "  yarn dev"
echo ""
echo "Verify installation anytime with:"
echo "  ./check-rust-setup.sh"
