import React from 'react';
import './profile.css'
import { AuthorLevelDisplay } from './AuthorLevelDisplay';
import { PromptArchive } from './PromptArchive';
import { BonusDisplay } from './BonusDisplay';

export function Profile(props) {
    const [profileStats, setProfileStats] = React.useState({ streak: 0, totalBonuses: 0, totalCritiques: 0 })
    React.useEffect(() => {
        async function fetchProfileStats() {
            const res = await fetch('/api/profile');
            if (res.ok) {
                const data = await res.json();
                setProfileStats(data);
            }
        }
        fetchProfileStats();
    }, []);

    return (
        <main>
            <div className="profileContainer">
                <img className="profilePicture" src="catProfilePic.jpeg" alt="Profile Picture" id="dropFirst" />
                <h2 className="authorName" id="dropFirst">{props.userName}</h2>
                <div className="streakContainer">
                    <span style={{ fontWeight: "bold" }}>{profileStats.streak}</span>
                    <span> DAY STREAK </span>
                </div>
                <AuthorLevelDisplay 
                    userName={props.userName} 
                    totalBonuses={profileStats.totalBonuses} 
                    totalCritiques={profileStats.totalCritiques} />
                <BonusDisplay />
            </div>
            <PromptArchive/>
        </main>
    );
}