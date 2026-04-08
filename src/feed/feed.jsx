import React from 'react';
import { ResponseCard } from './responseCard';
import { useWebSocket } from '../useWebSocket';
import './feed.css'

export function Feed(props) {
    const [responses, setResponses] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function loadResponses() {
            const res = await fetch('/api/response/all');
            if (res.ok) {
                const data = await res.json();
                setResponses(data);
            }
            setLoading(false);
        }
        loadResponses();
    }, []);

    useWebSocket(props.userName, (msg) => {
        if (msg.type === 'new_response') {
            setResponses(prev => {
                const alreadyExists = prev.some(r => r.username === msg.username);
                if (alreadyExists) return prev;
                const userResponse = prev.find(r => r.username === props.userName);
                const others = prev.filter(r => r.username !== props.userName);
                const newResponse = { username: msg.username, text: msg.text, timestamp: msg.timestamp, reactions: { likes: [], laughs: [], cries: [] }, critiques: [] };
                return userResponse ? [userResponse, newResponse, ...others] : [newResponse, ...others];
            });
        }
    });

    async function handleEdit(newText) {
        const res = await fetch('/api/response/edit', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: newText }),
        });
        if (res.ok) {
            const updated = await res.json();
            setResponses(prev =>
                prev.map(r => r.username === props.userName ? { ...r, text: updated.text } : r)
            );
            // re-evaluate bonuses since response text changed
            await fetch('/api/bonus/evaluate', { method: 'POST' });
        }
    }

    return (
        <main>
            <div className="promptContainer" id="dropFirst">
                <h1>~Daily Prompt~</h1>
                <input type="checkbox" id="expandToggle" hidden />
                <label htmlFor="expandToggle">⬇Click to Reveal Prompt⬇</label>
                <div id="expandedContent">{props.dailyPrompt}</div>
            </div>
            <div className="feed" id="dropFirst">
                <h2>Friend Feed:</h2>
                {loading && <p>Loading responses...</p>}
                {!loading && responses.length === 0 && <p>No responses yet today. Be the first!</p>}
                {responses.map((r) => (
                    <ResponseCard
                        key={r.username}
                        author={r.username}
                        currentUser={props.userName}
                        fullText={r.text}
                        reactions={r.reactions}
                        critiques={r.critiques}
                        isAuthor={r.username === props.userName}
                        onEdit={r.username === props.userName ? handleEdit : null}
                    />
                ))}
            </div>
        </main>
    );
}