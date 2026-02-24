import React from 'react';
import { CritiqueSection } from './critiqueSection';

export function ResponseCard({ author, fullText, initialReactions, initialCritiques, currentUser }) {
  const [reactions, setReactions] = React.useState(
    initialReactions || { like: 0, laugh: 0, cry: 0 }
  );
  const [userReactions, setUserReactions] = React.useState(
    { like: false, laugh: false, cry: false }
  );

  function handleReaction(type) {
    if (userReactions[type]) {
      setReactions(prev => ({ ...prev, [type]: prev[type] - 1 }));
      setUserReactions(prev => ({ ...prev, [type]: false }));
    } else {
      setReactions(prev => ({ ...prev, [type]: prev[type] + 1 }));
      setUserReactions(prev => ({ ...prev, [type]: true }));
    }
  }

  return (
    <div className="response">
        <div className="responseAuthorContainer">
            <span className="responseAuthor">{author}</span> wrote:
        </div>
        <div className="responseText">
            <details>
            <summary>"{fullText?.substring(0, 50) || "No response found"}..."</summary>
            <div className="fullText">{fullText || "No response found."}</div>
            </details>
        </div>
        <div className="reactionPanel">
            <button className="reactButton" onClick={() => handleReaction('like')}>
                {userReactions.like ? '💗 Liked' : '🩷 Like'} <span className="reactionCount">{reactions.like}</span>
            </button>
            <button className="reactButton" onClick={() => handleReaction('laugh')}>
                {userReactions.laugh ? '🤣 Laughed' : '😂 Laugh'} <span className="reactionCount">{reactions.laugh}</span>
            </button>
            <button className="reactButton" onClick={() => handleReaction('cry')}>
                {userReactions.cry ? '😭 Cried' : '😢 Cry'} <span className="reactionCount">{reactions.cry}</span>
            </button>
            <CritiqueSection
                initialCritiques={initialCritiques}
                currentUser={currentUser}
            />
        </div>
        
    </div>
  );
}