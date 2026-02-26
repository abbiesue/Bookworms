import React from 'react';
import './profile.css'
import { AuthorLevelDisplay } from './AuthorLevelDisplay';
import { PromptArchive } from './PromptArchive';
import { BonusDisplay } from './BonusDisplay';

export function Profile(props) {
    return (
        <main>
            <div className="profileContainer">
                <img className="profilePicture" src="catProfilePic.jpeg" alt="Profile Picture" id="dropFirst" />
                <h2 className="authorName" id="dropFirst">{props.userName}</h2>
                <div className="streakContainer">
                    <span style={{ fontWeight: "bold" }}>{props.streak}</span>
                    <span> DAY STREAK </span>
                </div>
                <AuthorLevelDisplay 
                    userName={props.userName} 
                    totalBonuses={props.totalBonuses} 
                    totalCritiques={props.totalCritiques} />
                <BonusDisplay />
            </div>
            <PromptArchive 
              dailyPrompt={props.dailyPrompt}
              userName={props.userName}
            />
        </main>
    );
}