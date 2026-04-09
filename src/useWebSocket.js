import { useEffect, useRef } from 'react';

export function useWebSocket(username, onMessage) {
    const ws = useRef(null);
    const onMessageRef = useRef(onMessage);

    useEffect(() => {
        onMessageRef.current = onMessage;
    });

    useEffect (() => {
        if (!username) return;

        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const host = window.location.host || 'startup.bookwormprompts.com';
        ws.current = new WebSocket(`${protocol}://${host}`);

        ws.current.onopen = () => {
            ws.current.send(JSON.stringify({ type: 'register', username }));
        };

        ws.current.onmessage = (event) => { 
            const msg = JSON.parse(event.data);
            onMessageRef.current(msg);
        };

        return () => ws.current?.close();
    }, [username]);

}