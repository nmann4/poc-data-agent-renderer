import React, { useRef, useEffect } from 'react';
import { loadWasmModule } from '../utils/wasmLoader';

interface ParticleSystemProps {
  isActive: boolean;
  useWasm: boolean;
}

export const ParticleSystemDemo: React.FC<ParticleSystemProps> = ({ isActive, useWasm }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const systemRef = useRef<any>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(Date.now());

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

        const system = new wasm.ParticleSystem(canvas.width, canvas.height, 500);
        systemRef.current = system;

        const animate = () => {
          if (!mounted || !isActive) return;

          const now = Date.now();
          const delta = (now - lastTimeRef.current) / 16.67; // Normalize to 60fps
          lastTimeRef.current = now;

          system.update(delta);
          const data = system.get_data();

          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          for (let i = 0; i < data.length; i += 4) {
            const x = data[i];
            const y = data[i + 1];
            const size = data[i + 2];
            const hue = data[i + 3];

            ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
          }

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
      width={800}
      height={600}
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  );
};
