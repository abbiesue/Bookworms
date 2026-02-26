import React from 'react';
import { ResponseCard } from './responseCard';
import './feed.css'

export function Feed(props) {
    const userResponse = localStorage.getItem(`response_${props.userName}`);
    const [liveResponses, setLiveResponses] = React.useState([]);
    const mockResponses = [
    {
        author: "StoryTeller99",
        fullText: "I always knew there was something different about Marcus. The way he moved through crowds like he owned them, the way villains seemed to flee at his mere presence...",
        initialReactions: { like: 0, laugh: 0, cry: 0 },
        initialCritiques: [],
    },
    {
        author: "QuillMaster",
        fullText: "She laughed when she saw the comic. 'That's supposed to be me?' The hero looked nothing like her — too tall, too confident, too sure of herself. Then again, maybe that was the point.",
        initialReactions: { like: 0, laugh: 0, cry: 0 },
        initialCritiques: [],
    },
    {
        author: "WordWitch",
        fullText: "The villain always gets the best lines. That's what they don't tell you when you're cast as the hero.",
        initialReactions: { like: 0, laugh: 0, cry: 0 },
        initialCritiques: [],
    },
    ];

    React.useEffect(() => {
    const timers = mockResponses.map((response, index) => {
        return setTimeout(() => {
        setLiveResponses(prev => [...prev, response]);
        }, (index + 1) * 5000);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
    }, []);


    return (
        <main>
            <div className="promptContainer" id="dropFirst">
                <h1>~Daily Prompt~</h1>
                <input type="checkbox" id="expandToggle" hidden />
                <label htmlFor="expandToggle">⬇Click to Reveal Prompt⬇</label>
                <div id="expandedContent"> {props.dailyPrompt} </div>
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
                
                {liveResponses.map((response, index) => (
                    <ResponseCard
                        key={`live-${index}`}
                        author={response.author}
                        currentUser={props.userName}
                        fullText={response.fullText}
                        initialReactions={response.initialReactions}
                        initialCritiques={response.initialCritiques}
                    />
                ))}
            </div>
        </main>    
    );
}