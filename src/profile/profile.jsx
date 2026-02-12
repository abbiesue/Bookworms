import React from 'react';
import './profile.css'

export function Profile() {
  return (
    <main>
        <div className="profileContainer">
            <img className="profilePicture" src="catProfilePic.jpeg" alt="Profile Picture" id="dropFirst" />
            <h2 className="authorName" id="dropFirst">BOOKWORMLVR_100</h2>
            <div className="streakContainer">
                <span style={{ fontWeight: "bold" }}>100</span>
                <span> DAY STREAK </span>
            </div>
            <div className="authorLevelContainer" id="dropSecond">
                <div className="authorLevel">CREATIVE GENIUS (level 100)</div>
                <span>next stage: VIB</span>
                <div>⭐️ 132 / 200 bonuses</div>
                <div>💬 30 / 50 critiques</div>
            </div>
            <div className="dailyBonuses" id="dropThird">
                <span style={{ fontSize: "large" }}>DAILY BONUSES:</span>
                <span className="bonusProgress">2/3</span>
                <ul>
                    <li className="bonus">
                        <input type="checkbox" id="bonus1" checked />
                        <label htmlFor="bonus1"><span className="text">use the word "intergalactic"</span></label>
                    </li>
                    <li className="bonus">
                        <input type="checkbox" id="bonus2" checked />
                        <label htmlFor="bonus2"><span className="text">set in the future</span></label>
                    </li>
                    <li className="bonus">
                        <input type="checkbox" id="bonus3" />
                        <label htmlFor="bonus3"><span className="text">make one character a cowboy</span></label>
                    </li>                                                
                </ul>
            </div>
        </div>
        <div className="promptArchive" id="dropThird">
            <h3>
                ~Prompt Archive~
            </h3>
            <input type="checkbox" id="expandToggle" hidden />
            <label htmlFor="expandToggle">⬇Click to Expand Archive⬇</label>
            <div id="expandedContent">
                This is where the prompts stored in the database would populate
            </div>
        </div>
    </main>
  );
}