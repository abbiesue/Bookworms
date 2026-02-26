import React from 'react';

export function PromptArchive({ dailyPrompt, userName }) {
    const userResponse = localStorage.getItem(`response_${userName}`);

    return (
        <div className="promptArchive">
            <h3>
                ~Prompt Archive~
            </h3>
            <input type="checkbox" id="archiveToggle" hidden />
            <label htmlFor="archiveToggle">⬇Click to Expand Archive⬇</label>
            <div id="archiveContent">
                {userResponse && (
                    <div className="archiveEntry">
                        <div className="archivePrompt">"{dailyPrompt}"</div>
                        <div className="archiveResponse">"{userResponse}"</div>
                    </div>
                )}
                <div className="archiveEntry">
                    <div className="archivePrompt">"Write about a time you felt truly lost..."</div>
                    <div className="archiveResponse">"The GPS said recalculating for the fourth time..."</div>
                </div>
                <div className="archiveEntry">
                    <div className="archivePrompt">"Describe a moment when you felt a strong connection to nature..."</div>
                    <div className="archiveResponse">"As I stood on the mountain peak, the world below felt so distant..."</div>
                </div>
            </div>
        </div>
    );
}
