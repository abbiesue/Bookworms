import React from 'react';
import { AuthorLevel } from './AuthorLevel';

export function AuthorLevelDisplay(props) {
    const authorLevel = new AuthorLevel(props.userName, props.totalBonuses, props.totalCritiques);
    authorLevel.setAuthorLevel();

    return (
        <div className="authorLevelContainer">
            <div className="authorLevel">{authorLevel.getLvlName()} : {authorLevel.getAuthorLevel()}</div>
            <span>to become {authorLevel.getNextLevelName()}:</span>
            <div>⭐️ {authorLevel.getTotalBonuses()} / {authorLevel.getNextLevelBonuses()} bonuses</div>
            <div>💬 {authorLevel.getTotalCritiques()} / {authorLevel.getNextLevelCritiques()} critiques</div>
        </div>
    );
}
