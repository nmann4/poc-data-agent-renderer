#!/bin/bash

echo "🚀 Setting up WebAssembly Visual Demos"
echo "======================================"
echo ""

# Check if yarn is installed
if ! command -v yarn &> /dev/null; then
    echo "❌ Yarn is not installed. Installing yarn..."
    npm install -g yarn
fi

echo "📦 Installing dependencies..."
yarn install

echo ""
echo "✅ Setup complete!"
echo ""
echo "Available commands:"
echo "  yarn dev     - Start development server"
echo "  yarn build   - Build for production"
echo "  yarn preview - Preview production build"
echo ""
echo "🎨 The app includes 4 WebAssembly demos:"
echo "  1. Particle System"
echo "  2. Ray Tracer"
echo "  3. Mandelbrot Set"
echo "  4. Game of Life"
echo ""
echo "💡 Note: Currently using JavaScript fallback implementations."
echo "   To build with Rust WASM (optional), see README.md"
echo ""
echo "🌐 To deploy to GitHub Pages:"
echo "   1. Commit and push to main branch"
echo "   2. Enable GitHub Pages in repository settings"
echo "   3. Select 'GitHub Actions' as source"
echo ""
echo "Ready to start? Run: yarn dev"
