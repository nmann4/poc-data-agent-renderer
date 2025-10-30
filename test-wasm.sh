#!/bin/bash

echo "🧪 Testing WASM Build"
echo "===================="
echo ""

# Check if WASM files exist
if [ ! -f "public/wasm/wasm_visuals_bg.wasm" ]; then
    echo "❌ WASM binary not found!"
    echo ""
    echo "Please build WASM first:"
    echo "  cd wasm && ./build.sh && cd .."
    exit 1
fi

echo "✓ WASM binary found"
echo ""

# Check file sizes
echo "File sizes:"
echo "-----------"
ls -lh public/wasm/wasm_visuals_bg.wasm
if [ -f "public/wasm/wasm_visuals.js" ]; then
    ls -lh public/wasm/wasm_visuals.js
fi
echo ""

# Validate WASM file
echo "Validating WASM binary..."
if file public/wasm/wasm_visuals_bg.wasm | grep -q "WebAssembly"; then
    echo "✓ Valid WebAssembly binary"
else
    echo "⚠ File might not be a valid WASM binary"
fi
echo ""

# Check for JavaScript bindings
if [ -f "public/wasm/wasm_visuals.js" ]; then
    echo "✓ JavaScript bindings found"
    
    # Check if it's the real WASM JS bindings (should import .wasm file)
    if grep -q "wasm_visuals_bg.wasm" public/wasm/wasm_visuals.js; then
        echo "✓ JavaScript bindings reference WASM file"
    else
        echo "⚠ JavaScript file appears to be the fallback version"
        echo "  (This is OK - WASM bindings will replace it)"
    fi
else
    echo "❌ JavaScript bindings not found"
fi
echo ""

# Test Rust compilation
echo "Testing Rust compilation..."
cd wasm
if cargo check --target wasm32-unknown-unknown 2>&1 | grep -q "Finished"; then
    echo "✓ Rust code compiles successfully"
else
    echo "❌ Rust compilation check failed"
    echo ""
    echo "Run this for details:"
    echo "  cd wasm && cargo check --target wasm32-unknown-unknown"
    cd ..
    exit 1
fi
cd ..
echo ""

# Summary
echo "===================="
echo "✅ WASM Build Test Complete!"
echo "===================="
echo ""
echo "Next steps:"
echo "1. Start the dev server: yarn dev"
echo "2. Open http://localhost:5174"
echo "3. Open browser console (F12)"
echo "4. Check for any WASM loading errors"
echo ""
echo "Expected behavior:"
echo "  • All 4 demos should work smoothly"
echo "  • Particle system should run at 60 FPS"
echo "  • No console errors about WASM"
echo ""
echo "To rebuild WASM after changes:"
echo "  cd wasm && ./build.sh && cd .."
