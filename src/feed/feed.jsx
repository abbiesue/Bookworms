import React from 'react';
import { ResponseCard } from './responseCard';
import './feed.css'

export function Feed(props) {
    const userResponse = localStorage.getItem(`response_${props.userName}`);
    return (
        <main>
            <div className="promptContainer" id="dropFirst">
                <h1>~Daily Prompt~</h1>
                <input type="checkbox" id="expandToggle" hidden />
                <label htmlFor="expandToggle">⬇Click to Reveal Prompt⬇</label>
                <div id="expandedContent">
                "Two friends realize they are characters in a comic; one is the hero, one the villain..."
                </div>
            </div>
            <div className="feed" id="dropFirst">
                <h2>Friend Feed:</h2>
                <ResponseCard
                    author={props.userName}
                    currentUser={props.userName}
                    fullText={userResponse}
                    initialReactions={{ like: 0, laugh: 0, cry: 0 }}
                    initialCritiques={[]}
                />

                <ResponseCard
                    author="Mia_writes"
                    currentUser={props.userName}
                    fullText='"Dont do it," he pleaded.
"This is the way," I, the mandolorian replied. Thankfully my super awesome mask covered my tears as I raised the blaster. "So long, friend."'
                    initialReactions={{ like: 3, laugh: 5, cry: 1 }}
                    initialCritiques={[
                        {author: "Tomatoe505", text: "lol I love Mando, where's grogu?"},
                        {author: "Tomatoe505", text: "wait does this count as fanfic?"}
                    ]}
                />

                <ResponseCard
                    author="Tomatoe505"
                    currentUser={props.userName}
                    fullText="Hey guys, I'm trying to keep my streak lol. I'll be serious about it tomorrow. Leave a like if you're watching the game tonight."
                    initialReactions={{ like: 8, laugh: 3, cry: 0 }}
                    initialCritiques={[
                        {author: "Mia_writes", text: "My like depends on which game you mean..."},
                        {author: "Tomatoe505", text: "the byu basketball game. go cougs!"}
                    ]}
                />
            </div>
        </main>    
    );
}