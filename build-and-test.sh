#!/bin/bash

# Source Rust environment if it exists
[ -f "$HOME/.cargo/env" ] && source "$HOME/.cargo/env"

echo "🚀 Complete WASM Build & Test Workflow"
echo "======================================"
echo ""

# Step 1: Check prerequisites
echo "Step 1: Checking prerequisites..."
echo "----------------------------------"
./check-rust-setup.sh

# Count installed prerequisites
RUST_OK=$(command -v rustc &> /dev/null && echo 1 || echo 0)
CARGO_OK=$(command -v cargo &> /dev/null && echo 1 || echo 0)
WASM_BINDGEN_OK=$(command -v wasm-bindgen &> /dev/null && echo 1 || echo 0)
WASM_TARGET_OK=$(rustup target list 2>/dev/null | grep -q "wasm32-unknown-unknown (installed)" && echo 1 || echo 0)

TOTAL=$((RUST_OK + CARGO_OK + WASM_BINDGEN_OK + WASM_TARGET_OK))

if [ $TOTAL -ne 4 ]; then
    echo ""
    echo "❌ Prerequisites not met (${TOTAL}/4 installed)"
    echo ""
    echo "Would you like to install the missing prerequisites now?"
    read -p "Install prerequisites? (y/N) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ./install-rust.sh
        
        # Recheck after installation
        source $HOME/.cargo/env 2>/dev/null
        TOTAL=$(($(command -v rustc &> /dev/null && echo 1 || echo 0) + \
                 $(command -v cargo &> /dev/null && echo 1 || echo 0) + \
                 $(command -v wasm-bindgen &> /dev/null && echo 1 || echo 0) + \
                 $(rustup target list 2>/dev/null | grep -q "wasm32-unknown-unknown (installed)" && echo 1 || echo 0)))
        
        if [ $TOTAL -ne 4 ]; then
            echo "❌ Installation incomplete. Please check errors above."
            exit 1
        fi
    else
        echo "Installation cancelled. Please install prerequisites manually."
        echo "See TESTING_RUST_WASM.md for instructions."
        exit 1
    fi
fi

echo ""
echo "Step 2: Building WASM module..."
echo "--------------------------------"

cd wasm
if ./build.sh; then
    echo "✓ WASM build successful!"
else
    echo "❌ WASM build failed!"
    echo "Check errors above for details."
    cd ..
    exit 1
fi
cd ..

echo ""
echo "Step 3: Testing WASM build..."
echo "------------------------------"

./test-wasm.sh

echo ""
echo "Step 4: Starting development server..."
echo "--------------------------------------"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

yarn dev
