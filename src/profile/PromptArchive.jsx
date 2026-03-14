import React from 'react';

export function PromptArchive() {
    const [todaysResponse, setTodaysResponse] = React.useState({ responded: false });
    React.useEffect(() => {
        async function fetchTodaysResponse() {
            const res = await fetch('/api/response/user');
            if (res.ok) {
                const data = await res.json();
                setTodaysResponse(data);
            }
        }
        fetchTodaysResponse();
    }, []);

    const [pastEntries, setPastEntries] = React.useState([]);
    React.useEffect(() => {
        async function fetchPastEntries() {
            const res = await fetch('/api/archive');
            if (res.ok) {
                const data = await res.json();
                setPastEntries(data);
            }
        }
        fetchPastEntries();
    }, []);

    return (
        <div className="promptArchive">
            <h3>
                ~Prompt Archive~
            </h3>
            <input type="checkbox" id="archiveToggle" hidden />
            <label htmlFor="archiveToggle">⬇Click to Expand Archive⬇</label>
            <div id="archiveContent">
                {todaysResponse.responded && (
                    <div className="archiveEntry">
                        <div className="archivePrompt">{new Date(todaysResponse.response.date).toLocaleDateString()}: "{todaysResponse.response.prompt}"</div>
                        <div className="archiveResponse">"{todaysResponse.response.text}"</div>
                    </div>
                )}
                {pastEntries.map((entry, index) => (
                    <div className="archiveEntry" key={index}>
                        <div className="archivePrompt">{new Date(entry.date).toLocaleDateString()}: "{entry.prompt}"</div>
                        <div className="archiveResponse">"{entry.text}"</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
