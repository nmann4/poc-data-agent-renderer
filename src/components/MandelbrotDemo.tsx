import React, { useRef, useEffect, useState } from 'react';
import { loadWasmModule } from '../utils/wasmLoader';

interface MandelbrotDemoProps {
  isActive: boolean;
  useWasm: boolean;
}

export const MandelbrotDemo: React.FC<MandelbrotDemoProps> = ({ isActive, useWasm }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [centerX, setCenterX] = useState(-0.5);
  const [centerY, setCenterY] = useState(0);
  const [maxIter, setMaxIter] = useState(100);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let mounted = true;

    const render = async () => {
      try {
        const wasm = await loadWasmModule(useWasm);

        if (!mounted) return;

        const width = canvas.width;
        const height = canvas.height;
        
        const size = 3 / zoom;
        const xMin = centerX - size;
        const xMax = centerX + size;
        const yMin = centerY - size;
        const yMax = centerY + size;

        const data = wasm.mandelbrot(width, height, xMin, xMax, yMin, yMax, maxIter);
        
        const imageData = new ImageData(new Uint8ClampedArray(data), width, height);
        ctx.putImageData(imageData, 0, 0);
      } catch (error) {
        console.error('Failed to render Mandelbrot:', error);
      }
    };

    render();

    return () => {
      mounted = false;
    };
  }, [isActive, zoom, centerX, centerY, maxIter, useWasm]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const size = 3 / zoom;
    const newCenterX = centerX - size + x * size * 2;
    const newCenterY = centerY - size + y * size * 2;

    setCenterX(newCenterX);
    setCenterY(newCenterY);
    setZoom(zoom * 2);
  };

  const handleReset = () => {
    setZoom(1);
    setCenterX(-0.5);
    setCenterY(0);
    setMaxIter(100);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onClick={handleCanvasClick}
        style={{
          width: '100%',
          flex: 1,
          objectFit: 'contain',
          cursor: 'zoom-in',
          border: '1px solid #333',
        }}
      />
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label>Iterations:</label>
          <input
            type="range"
            min="50"
            max="500"
            value={maxIter}
            onChange={(e) => setMaxIter(Number(e.target.value))}
            style={{ width: '150px' }}
          />
          <span>{maxIter}</span>
        </div>
        <button onClick={handleReset} style={{ padding: '8px 16px' }}>
          Reset View
        </button>
        <div style={{ fontSize: '14px', color: '#888' }}>
          Zoom: {zoom.toFixed(1)}x | Click to zoom in
        </div>
      </div>
    </div>
  );
};
