import React from 'react';

const HANDSHAKE_READY_TYPE = 'file-renderer-poc:ready';
const HANDSHAKE_DATA_TYPE = 'file-renderer-poc:data';

const stringifyParams = (params: URLSearchParams) => {
    const result: Record<string, string> = {};
    params.forEach((value, key) => {
        result[key] = value;
    });
    return result;
};

const App: React.FC = () => {
    const { paramsObject, queryString } = React.useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        return {
            paramsObject: stringifyParams(params),
            queryString: params.toString() || '(none)',
        };
    }, []);
    const [hostPayload, setHostPayload] = React.useState<unknown>(undefined);

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
        <div style={{ padding: '24px', maxWidth: '640px', margin: '0 auto' }}>
            <header>
                <h1 style={{ marginBottom: '8px' }}>Remote renderer (POC)</h1>
                <p style={{ marginTop: 0 }}>
                    This page is served from <code>localhost:5173</code> and embedded inside the Data Agent iframe. It
                    simply echoes the query parameters passed by the host application.
                </p>
            </header>
            <section>
                <h2 style={{ marginBottom: '4px' }}>Query String</h2>
                <pre
                    style={{
                        backgroundColor: '#1f2933',
                        padding: '12px',
                        borderRadius: '8px',
                        overflowX: 'auto',
                    }}
                >
                    {queryString}
                </pre>
            </section>
            <section>
                <h2 style={{ marginBottom: '4px' }}>Parsed Parameters</h2>
                <pre
                    style={{
                        backgroundColor: '#1f2933',
                        padding: '12px',
                        borderRadius: '8px',
                        overflowX: 'auto',
                    }}
                >
                    {JSON.stringify(paramsObject, null, 2)}
                </pre>
            </section>
            <section>
                <h2 style={{ marginBottom: '4px' }}>Data From Host</h2>
                <pre
                    style={{
                        backgroundColor: '#1f2933',
                        padding: '12px',
                        borderRadius: '8px',
                        overflowX: 'auto',
                    }}
                >
                    {hostPayload ? JSON.stringify(hostPayload, null, 2) : '(waiting for host)'}
                </pre>
            </section>
        </div>
    );
};

export default App;
