#!/bin/bash

# Source Rust environment if it exists
[ -f "$HOME/.cargo/env" ] && source "$HOME/.cargo/env"

echo "🦀 Rust/WASM Setup Checker"
echo "=========================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check functions
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        $1 --version | head -n 1
        return 0
    else
        echo -e "${RED}✗${NC} $1 is NOT installed"
        return 1
    fi
}

echo "Checking Rust toolchain..."
echo ""

# Check Rust
RUST_OK=0
if check_command rustc; then
    RUST_OK=1
fi
echo ""

# Check Cargo
CARGO_OK=0
if check_command cargo; then
    CARGO_OK=1
fi
echo ""

# Check wasm-bindgen
WASM_BINDGEN_OK=0
if check_command wasm-bindgen; then
    WASM_BINDGEN_OK=1
fi
echo ""

# Check wasm32 target
echo "Checking WebAssembly target..."
if rustup target list 2>/dev/null | grep -q "wasm32-unknown-unknown (installed)"; then
    echo -e "${GREEN}✓${NC} wasm32-unknown-unknown target is installed"
    WASM_TARGET_OK=1
else
    echo -e "${RED}✗${NC} wasm32-unknown-unknown target is NOT installed"
    WASM_TARGET_OK=0
fi
echo ""

# Check if WASM has been built
echo "Checking for built WASM files..."
if [ -f "public/wasm/wasm_visuals_bg.wasm" ]; then
    echo -e "${GREEN}✓${NC} WASM binary found"
    ls -lh public/wasm/wasm_visuals_bg.wasm
    WASM_BUILT=1
else
    echo -e "${YELLOW}⚠${NC} WASM binary not found (not built yet)"
    WASM_BUILT=0
fi
echo ""

# Summary
echo "=========================="
echo "Summary:"
echo "=========================="

TOTAL=0
if [ $RUST_OK -eq 1 ]; then ((TOTAL++)); fi
if [ $CARGO_OK -eq 1 ]; then ((TOTAL++)); fi
if [ $WASM_BINDGEN_OK -eq 1 ]; then ((TOTAL++)); fi
if [ $WASM_TARGET_OK -eq 1 ]; then ((TOTAL++)); fi

echo "Setup Progress: $TOTAL/4 prerequisites installed"
echo ""

if [ $TOTAL -eq 4 ]; then
    echo -e "${GREEN}✓ All prerequisites installed!${NC}"
    echo ""
    if [ $WASM_BUILT -eq 1 ]; then
        echo -e "${GREEN}✓ WASM is already built and ready!${NC}"
        echo ""
        echo "You can start the dev server:"
        echo "  yarn dev"
    else
        echo "Next step: Build the WASM module"
        echo "  cd wasm && ./build.sh && cd .."
    fi
else
    echo -e "${YELLOW}⚠ Missing prerequisites${NC}"
    echo ""
    echo "Installation steps:"
    echo ""
    
    if [ $RUST_OK -eq 0 ] || [ $CARGO_OK -eq 0 ]; then
        echo "1. Install Rust:"
        echo "   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
        echo "   source \$HOME/.cargo/env"
        echo ""
    fi
    
    if [ $WASM_TARGET_OK -eq 0 ]; then
        echo "2. Add WebAssembly target:"
        echo "   rustup target add wasm32-unknown-unknown"
        echo ""
    fi
    
    if [ $WASM_BINDGEN_OK -eq 0 ]; then
        echo "3. Install wasm-bindgen:"
        echo "   cargo install wasm-bindgen-cli"
        echo ""
    fi
    
    echo "4. Then build WASM:"
    echo "   cd wasm && ./build.sh && cd .."
    echo ""
fi

echo "For detailed instructions, see: TESTING_RUST_WASM.md"
