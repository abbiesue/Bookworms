import React from 'react';

export function BonusDisplay(props) {
    return (
        <div className="dailyBonuses" id="dropThird">
            <span style={{ fontSize: "large" }}>DAILY BONUSES:</span>
            <span className="bonusProgress">2/3</span>
            <ul>
                <li className="bonus">
                    <input type="checkbox" id="bonus1" defaultChecked />
                    <label htmlFor="bonus1"><span className="text">use the word "intergalactic"</span></label>
                </li>
                <li className="bonus">
                    <input type="checkbox" id="bonus2" defaultChecked />
                    <label htmlFor="bonus2"><span className="text">set in the future</span></label>
                </li>
                <li className="bonus">
                    <input type="checkbox" id="bonus3" />
                    <label htmlFor="bonus3"><span className="text">make one character a cowboy</span></label>
                </li>                                                
            </ul>
        </div>
    );
}
