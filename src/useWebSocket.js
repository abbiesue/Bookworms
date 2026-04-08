import { useEffect, useRef } from 'react';

export function useWebSocket(username, onMessage) {
    const ws = useRef(null);
    useEffect (() => {
        if (!username) return;

        const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        ws.current = new WebSocket(`${protocol}://${window.location.host}`);

        ws.current.onopen = () => {
            ws.current.send(JSON.stringify({ type: 'register', username }));
        };

        ws.current.onmessage = (event) => { 
            const msg = JSON.parse(event.data);
            onMessage(msg);
        };

        return () => ws.current.close();
    }, [username]);

}