import React, { useRef, useEffect } from 'react';
import { loadWasmModule } from '../utils/wasmLoader';

interface RayTraceDemoProps {
  isActive: boolean;
  useWasm: boolean;
}

export const RayTraceDemo: React.FC<RayTraceDemoProps> = ({ isActive, useWasm }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let mounted = true;

    const init = async () => {
      try {
        const wasm = await loadWasmModule(useWasm);

        if (!mounted) return;

        const animate = () => {
          if (!mounted || !isActive) return;

          const time = (Date.now() - startTimeRef.current) / 1000;
          const data = wasm.raytrace(canvas.width, canvas.height, time);
          
          const imageData = new ImageData(new Uint8ClampedArray(data), canvas.width, canvas.height);
          ctx.putImageData(imageData, 0, 0);

          animationRef.current = requestAnimationFrame(animate);
        };

        animate();
      } catch (error) {
        console.error('Failed to load WASM:', error);
      }
    };

    init();

    return () => {
      mounted = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, useWasm]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={300}
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  );
};
