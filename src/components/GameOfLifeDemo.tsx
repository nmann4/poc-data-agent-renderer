import React, { useRef, useEffect, useState } from 'react';
import { loadWasmModule } from '../utils/wasmLoader';

interface GameOfLifeDemoProps {
  isActive: boolean;
  useWasm: boolean;
}

export const GameOfLifeDemo: React.FC<GameOfLifeDemoProps> = ({ isActive, useWasm }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<any>(null);
  const animationRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(5);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let mounted = true;
    let frameCount = 0;

    const init = async () => {
      try {
        const wasm = await loadWasmModule(useWasm);

        if (!mounted) return;

        const game = new wasm.GameOfLife(200, 150);
        gameRef.current = game;

        const animate = () => {
          if (!mounted || !isActive) return;

          if (isPlaying) {
            frameCount++;
            if (frameCount >= 60 / speed) {
              game.step();
              frameCount = 0;
            }
          }

          const data = game.get_cells();
          const imageData = new ImageData(new Uint8ClampedArray(data), 200, 150);
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
  }, [isActive, isPlaying, speed, useWasm]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const game = gameRef.current;
    if (!game) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * 200);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * 150);

    game.toggle_cell(x, y);
  };

  const handleClear = () => {
    if (gameRef.current) {
      gameRef.current.clear();
    }
  };

  const handleRandomize = () => {
    if (gameRef.current) {
      gameRef.current.randomize();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      <canvas
        ref={canvasRef}
        width={200}
        height={150}
        onClick={handleCanvasClick}
        style={{
          width: '100%',
          flex: 1,
          objectFit: 'contain',
          imageRendering: 'pixelated',
          border: '1px solid #333',
          cursor: 'crosshair',
        }}
      />
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => setIsPlaying(!isPlaying)} style={{ padding: '8px 16px' }}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={handleClear} style={{ padding: '8px 16px' }}>
          Clear
        </button>
        <button onClick={handleRandomize} style={{ padding: '8px 16px' }}>
          Randomize
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label>Speed:</label>
          <input
            type="range"
            min="1"
            max="30"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={{ width: '150px' }}
          />
          <span>{speed} steps/sec</span>
        </div>
      </div>
      <div style={{ fontSize: '14px', color: '#888' }}>
        Click cells to toggle them on/off
      </div>
    </div>
  );
};
