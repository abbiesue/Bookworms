import React from 'react';

export function PromptArchive() {
    return (
        <div className="promptArchive">
            <h3>
                ~Prompt Archive~
            </h3>
            <input type="checkbox" id="expandToggle" hidden />
            <label htmlFor="expandToggle">⬇Click to Expand Archive⬇</label>
            <div id="expandedContent">
                This is where the prompts stored in the database would populate
            </div>
        </div>
    );
}
