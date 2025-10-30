import React, { useState } from 'react';
import { ParticleSystemDemo } from './components/ParticleSystemDemo';
import { MandelbrotDemo } from './components/MandelbrotDemo';
import { GameOfLifeDemo } from './components/GameOfLifeDemo';
import { RayTraceDemo } from './components/RayTraceDemo';
import { FPSCounter } from './components/FPSCounter';

const HANDSHAKE_READY_TYPE = 'file-renderer-poc:ready';
const HANDSHAKE_DATA_TYPE = 'file-renderer-poc:data';

const stringifyParams = (params: URLSearchParams) => {
    const result: Record<string, string> = {};
    params.forEach((value, key) => {
        result[key] = value;
    });
    return result;
};

type DemoType = 'particles' | 'mandelbrot' | 'gameoflife' | 'raytrace';

const demos = [
  { id: 'particles' as DemoType, name: 'Particle System', description: 'Physics-based particle simulation' },
  { id: 'raytrace' as DemoType, name: 'Ray Tracer', description: 'Real-time 3D sphere rendering' },
  { id: 'mandelbrot' as DemoType, name: 'Mandelbrot Set', description: 'Interactive fractal explorer' },
  { id: 'gameoflife' as DemoType, name: 'Game of Life', description: 'Conway\'s cellular automaton' },
];

const App: React.FC = () => {
    const [activeDemo, setActiveDemo] = useState<DemoType>('particles');
    const [useWasm, setUseWasm] = useState(true);
    const [hostPayload, setHostPayload] = React.useState<unknown>(undefined);
    
    const { paramsObject, queryString } = React.useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        return {
            paramsObject: stringifyParams(params),
            queryString: params.toString() || '(none)',
        };
    }, []);

    React.useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (!event.data || typeof event.data !== 'object') {
                return;
            }

            if (event.data.type !== HANDSHAKE_DATA_TYPE) {
                return;
            }

            setHostPayload(event.data.payload);
        };

        window.addEventListener('message', handleMessage);
        window.parent?.postMessage({ type: HANDSHAKE_READY_TYPE }, '*');

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            backgroundColor: '#0a0e14',
            color: '#f3f4f6'
        }}>
            <header style={{ 
                padding: '24px', 
                borderBottom: '1px solid #1f2937',
                backgroundColor: '#151921'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h1 style={{ margin: '0 0 8px 0', fontSize: '32px' }}>
                            🚀 WebAssembly Visual Demos
                        </h1>
                        <p style={{ margin: 0, color: '#9ca3af', fontSize: '16px' }}>
                            High-performance graphics powered by Rust + WebAssembly
                        </p>
                    </div>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        padding: '12px 20px',
                        backgroundColor: '#1f2937',
                        borderRadius: '8px',
                        border: '1px solid #374151'
                    }}>
                        <span style={{ 
                            fontSize: '14px', 
                            fontWeight: '600',
                            color: !useWasm ? '#60a5fa' : '#6b7280'
                        }}>
                            JavaScript
                        </span>
                        <label style={{ 
                            position: 'relative',
                            display: 'inline-block',
                            width: '48px',
                            height: '24px',
                            cursor: 'pointer'
                        }}>
                            <input
                                type="checkbox"
                                checked={useWasm}
                                onChange={(e) => setUseWasm(e.target.checked)}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: useWasm ? '#3b82f6' : '#4b5563',
                                borderRadius: '24px',
                                transition: 'background-color 0.3s',
                            }}>
                                <span style={{
                                    position: 'absolute',
                                    height: '18px',
                                    width: '18px',
                                    left: useWasm ? '27px' : '3px',
                                    bottom: '3px',
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                    transition: 'left 0.3s',
                                }} />
                            </span>
                        </label>
                        <span style={{ 
                            fontSize: '14px', 
                            fontWeight: '600',
                            color: useWasm ? '#60a5fa' : '#6b7280'
                        }}>
                            WebAssembly
                        </span>
                    </div>
                </div>
            </header>
            
            <nav style={{ 
                padding: '16px 24px', 
                borderBottom: '1px solid #1f2937',
                backgroundColor: '#151921',
                display: 'flex',
                gap: '12px',
                overflowX: 'auto'
            }}>
                {demos.map(demo => (
                    <button
                        key={demo.id}
                        onClick={() => setActiveDemo(demo.id)}
                        style={{
                            padding: '12px 24px',
                            border: activeDemo === demo.id ? '2px solid #3b82f6' : '2px solid #374151',
                            borderRadius: '8px',
                            backgroundColor: activeDemo === demo.id ? '#1e3a8a' : '#1f2937',
                            color: activeDemo === demo.id ? '#60a5fa' : '#9ca3af',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap',
                        }}
                        onMouseOver={(e) => {
                            if (activeDemo !== demo.id) {
                                e.currentTarget.style.backgroundColor = '#374151';
                                e.currentTarget.style.color = '#f3f4f6';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (activeDemo !== demo.id) {
                                e.currentTarget.style.backgroundColor = '#1f2937';
                                e.currentTarget.style.color = '#9ca3af';
                            }
                        }}
                    >
                        <div>{demo.name}</div>
                        <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '4px' }}>
                            {demo.description}
                        </div>
                    </button>
                ))}
            </nav>

            <main style={{ 
                flex: 1, 
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '600px'
            }}>
                <div style={{ 
                    width: '100%', 
                    maxWidth: '1200px',
                    height: '100%',
                    backgroundColor: '#151921',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid #1f2937',
                    position: 'relative'
                }}>
                    <FPSCounter useWasm={useWasm} />
                    {activeDemo === 'particles' && <ParticleSystemDemo isActive={activeDemo === 'particles'} useWasm={useWasm} />}
                    {activeDemo === 'raytrace' && <RayTraceDemo isActive={activeDemo === 'raytrace'} useWasm={useWasm} />}
                    {activeDemo === 'mandelbrot' && <MandelbrotDemo isActive={activeDemo === 'mandelbrot'} useWasm={useWasm} />}
                    {activeDemo === 'gameoflife' && <GameOfLifeDemo isActive={activeDemo === 'gameoflife'} useWasm={useWasm} />}
                </div>
            </main>

            <footer style={{ 
                padding: '24px', 
                borderTop: '1px solid #1f2937',
                backgroundColor: '#151921'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '18px', marginBottom: '12px', color: '#f3f4f6' }}>
                        📡 Data Agent Integration
                    </h2>
                    
                    <section style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '14px', marginBottom: '8px', color: '#9ca3af' }}>Query String</h3>
                        <pre
                            style={{
                                backgroundColor: '#1f2933',
                                padding: '12px',
                                borderRadius: '8px',
                                overflowX: 'auto',
                                fontSize: '12px',
                                margin: 0,
                            }}
                        >
                            {queryString}
                        </pre>
                    </section>
                    
                    <section style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '14px', marginBottom: '8px', color: '#9ca3af' }}>Parsed Parameters</h3>
                        <pre
                            style={{
                                backgroundColor: '#1f2933',
                                padding: '12px',
                                borderRadius: '8px',
                                overflowX: 'auto',
                                fontSize: '12px',
                                margin: 0,
                            }}
                        >
                            {JSON.stringify(paramsObject, null, 2)}
                        </pre>
                    </section>
                    
                    <section>
                        <h3 style={{ fontSize: '14px', marginBottom: '8px', color: '#9ca3af' }}>Data From Host (postMessage)</h3>
                        <pre
                            style={{
                                backgroundColor: '#1f2933',
                                padding: '12px',
                                borderRadius: '8px',
                                overflowX: 'auto',
                                fontSize: '12px',
                                margin: 0,
                            }}
                        >
                            {hostPayload ? JSON.stringify(hostPayload, null, 2) : '(waiting for host)'}
                        </pre>
                    </section>

                    <p style={{ 
                        marginTop: '20px', 
                        textAlign: 'center', 
                        color: '#6b7280', 
                        fontSize: '12px' 
                    }}>
                        Built with React + TypeScript + Rust/WebAssembly | 
                        All computations run in WebAssembly for maximum performance
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default App;
