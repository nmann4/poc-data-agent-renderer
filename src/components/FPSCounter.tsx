import React from 'react';
import { useFPS } from '../hooks/useFPS';

interface FPSCounterProps {
  useWasm: boolean;
}

export const FPSCounter: React.FC<FPSCounterProps> = ({ useWasm }) => {
  const fps = useFPS();

  // Determine color based on FPS
  const getColor = (fps: number) => {
    if (fps >= 55) return '#22c55e'; // Green
    if (fps >= 30) return '#eab308'; // Yellow
    return '#ef4444'; // Red
  };

  return (
    <div style={{
      position: 'absolute',
      top: '16px',
      right: '16px',
      padding: '12px 16px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderRadius: '8px',
      border: `2px solid ${getColor(fps)}`,
      fontFamily: 'monospace',
      fontSize: '14px',
      fontWeight: 'bold',
      zIndex: 1000,
    }}>
      <div style={{ color: '#9ca3af', fontSize: '10px', marginBottom: '4px' }}>
        {useWasm ? '🚀 WASM' : '📦 JavaScript'}
      </div>
      <div style={{ color: getColor(fps), fontSize: '20px' }}>
        {fps} FPS
      </div>
    </div>
  );
};
