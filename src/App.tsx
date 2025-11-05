import React, { useState } from "react";
import { ParticleSystemDemo } from "./components/ParticleSystemDemo";
import { MandelbrotDemo } from "./components/MandelbrotDemo";
import { GameOfLifeDemo } from "./components/GameOfLifeDemo";
import { RayTraceDemo } from "./components/RayTraceDemo";
import { FPSCounter } from "./components/FPSCounter";

const HANDSHAKE_READY_TYPE = "file-renderer-poc:ready";
const HANDSHAKE_DATA_TYPE = "file-renderer-poc:data";

const stringifyParams = (params: URLSearchParams) => {
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

type DemoType = "particles" | "mandelbrot" | "gameoflife" | "raytrace";

const demos = [
  {
    id: "particles" as DemoType,
    name: "Particle System",
    description: "Physics-based particle simulation",
  },
  {
    id: "raytrace" as DemoType,
    name: "Ray Tracer",
    description: "Real-time 3D sphere rendering",
  },
  {
    id: "mandelbrot" as DemoType,
    name: "Mandelbrot Set",
    description: "Interactive fractal explorer",
  },
  {
    id: "gameoflife" as DemoType,
    name: "Game of Life",
    description: "Conway's cellular automaton",
  },
];

const App: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<DemoType>("particles");
  const [useWasm, setUseWasm] = useState(true);
  const [hostPayload, setHostPayload] = React.useState<unknown>(undefined);

  const { paramsObject, queryString } = React.useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      paramsObject: stringifyParams(params),
      queryString: params.toString() || "(none)",
    };
  }, []);

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== "object") {
        return;
      }

      if (event.data.type !== HANDSHAKE_DATA_TYPE) {
        return;
      }

      setHostPayload(event.data.payload);
    };

    window.addEventListener("message", handleMessage);
    window.parent?.postMessage({ type: HANDSHAKE_READY_TYPE }, "*");

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#faf9f8",
        color: "#323130",
      }}
    >
      <header
        style={{
          padding: "20px 32px",
          borderBottom: "1px solid #edebe9",
          backgroundColor: "#ffffff",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1
              style={{
                margin: "0 0 4px 0",
                fontSize: "24px",
                fontWeight: "600",
                color: "#323130",
              }}
            >
              WebAssembly Visual Demos
            </h1>
            <p style={{ margin: 0, color: "#605e5c", fontSize: "14px" }}>
              High-performance graphics powered by Rust + WebAssembly
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 16px",
              backgroundColor: "#f3f2f1",
              borderRadius: "4px",
              border: "1px solid #edebe9",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: "400",
                color: !useWasm ? "#0078d4" : "#605e5c",
              }}
            >
              JavaScript
            </span>
            <label
              style={{
                position: "relative",
                display: "inline-block",
                width: "40px",
                height: "20px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={useWasm}
                onChange={(e) => setUseWasm(e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: useWasm ? "#0078d4" : "#a19f9d",
                  borderRadius: "20px",
                  transition: "background-color 0.2s",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    height: "14px",
                    width: "14px",
                    left: useWasm ? "23px" : "3px",
                    bottom: "3px",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    transition: "left 0.2s",
                  }}
                />
              </span>
            </label>
            <span
              style={{
                fontSize: "13px",
                fontWeight: "400",
                color: useWasm ? "#0078d4" : "#605e5c",
              }}
            >
              WebAssembly
            </span>
          </div>
        </div>
      </header>

      <nav
        style={{
          padding: "12px 32px",
          borderBottom: "1px solid #edebe9",
          backgroundColor: "#ffffff",
          display: "flex",
          gap: "8px",
          overflowX: "auto",
        }}
      >
        {demos.map((demo) => (
          <button
            key={demo.id}
            onClick={() => setActiveDemo(demo.id)}
            style={{
              padding: "10px 20px",
              border: "none",
              borderBottom:
                activeDemo === demo.id
                  ? "2px solid #0078d4"
                  : "2px solid transparent",
              borderRadius: "0",
              backgroundColor: "transparent",
              color: activeDemo === demo.id ? "#0078d4" : "#605e5c",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: activeDemo === demo.id ? "600" : "400",
              transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}
            onMouseOver={(e) => {
              if (activeDemo !== demo.id) {
                e.currentTarget.style.color = "#323130";
              }
            }}
            onMouseOut={(e) => {
              if (activeDemo !== demo.id) {
                e.currentTarget.style.color = "#605e5c";
              }
            }}
          >
            <div>{demo.name}</div>
            <div style={{ fontSize: "11px", opacity: 0.7, marginTop: "2px" }}>
              {demo.description}
            </div>
          </button>
        ))}
      </nav>

      <main
        style={{
          flex: 1,
          padding: "24px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "600px",
          backgroundColor: "#faf9f8",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            height: "100%",
            backgroundColor: "#ffffff",
            borderRadius: "4px",
            padding: "24px",
            border: "1px solid #edebe9",
            boxShadow: "0 1.6px 3.6px 0 rgba(0,0,0,0.132)",
            position: "relative",
          }}
        >
          <FPSCounter useWasm={useWasm} />
          {activeDemo === "particles" && (
            <ParticleSystemDemo
              isActive={activeDemo === "particles"}
              useWasm={useWasm}
            />
          )}
          {activeDemo === "raytrace" && (
            <RayTraceDemo
              isActive={activeDemo === "raytrace"}
              useWasm={useWasm}
            />
          )}
          {activeDemo === "mandelbrot" && (
            <MandelbrotDemo
              isActive={activeDemo === "mandelbrot"}
              useWasm={useWasm}
            />
          )}
          {activeDemo === "gameoflife" && (
            <GameOfLifeDemo
              isActive={activeDemo === "gameoflife"}
              useWasm={useWasm}
            />
          )}
        </div>
      </main>

      <footer
        style={{
          padding: "24px 32px",
          borderTop: "1px solid #edebe9",
          backgroundColor: "#ffffff",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "16px",
              marginBottom: "16px",
              color: "#323130",
              fontWeight: "600",
            }}
          >
            Data Agent Integration
          </h2>

          <section style={{ marginBottom: "16px" }}>
            <h3
              style={{
                fontSize: "13px",
                marginBottom: "8px",
                color: "#605e5c",
                fontWeight: "600",
              }}
            >
              Query String
            </h3>
            <pre
              style={{
                backgroundColor: "#f3f2f1",
                padding: "12px",
                borderRadius: "4px",
                overflowX: "auto",
                fontSize: "12px",
                margin: 0,
                border: "1px solid #edebe9",
                color: "#323130",
              }}
            >
              {queryString}
            </pre>
          </section>

          <section style={{ marginBottom: "16px" }}>
            <h3
              style={{
                fontSize: "13px",
                marginBottom: "8px",
                color: "#605e5c",
                fontWeight: "600",
              }}
            >
              Parsed Parameters
            </h3>
            <pre
              style={{
                backgroundColor: "#f3f2f1",
                padding: "12px",
                borderRadius: "4px",
                overflowX: "auto",
                fontSize: "12px",
                margin: 0,
                border: "1px solid #edebe9",
                color: "#323130",
              }}
            >
              {JSON.stringify(paramsObject, null, 2)}
            </pre>
          </section>

          <section>
            <h3
              style={{
                fontSize: "13px",
                marginBottom: "8px",
                color: "#605e5c",
                fontWeight: "600",
              }}
            >
              Data From Host (postMessage)
            </h3>
            <pre
              style={{
                backgroundColor: "#f3f2f1",
                padding: "12px",
                borderRadius: "4px",
                overflowX: "auto",
                fontSize: "12px",
                margin: 0,
                border: "1px solid #edebe9",
                color: "#323130",
              }}
            >
              {hostPayload
                ? JSON.stringify(hostPayload, null, 2)
                : "(waiting for host)"}
            </pre>
          </section>

          <p
            style={{
              marginTop: "20px",
              textAlign: "center",
              color: "#8a8886",
              fontSize: "12px",
            }}
          >
            Built with React + TypeScript + Rust/WebAssembly | All computations
            run in WebAssembly for maximum performance
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
