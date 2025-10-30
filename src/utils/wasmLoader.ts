// Helper to dynamically load WASM or JS fallback
export async function loadWasmModule(useWasm: boolean) {
  if (useWasm) {
    try {
      // Try to load WASM version
      const wasmModule = await import('../../public/wasm/wasm_visuals.js');
      await wasmModule.default();
      console.log('✅ Using WebAssembly (High Performance)');
      return wasmModule;
    } catch (error) {
      console.warn('⚠️ WASM not available, falling back to JavaScript');
      console.error(error);
    }
  }
  
  // Load JavaScript fallback
  const jsModule = await import('../../public/wasm/wasm_visuals.js');
  console.log('📦 Using JavaScript Fallback');
  return jsModule;
}
