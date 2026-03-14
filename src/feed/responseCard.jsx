import React from 'react';
import { CritiqueSection } from './critiqueSection';

export function ResponseCard({ author, fullText, reactions: initialReactions, critiques, currentUser, isAuthor, onEdit }) {
  const [reactions, setReactions] = React.useState(
    initialReactions || { likeCount: 0, laughCount: 0, cryCount: 0 }
  );
  const [userReactions, setUserReactions] = React.useState(
    initialReactions?.userReacted || { like: false, laugh: false, cry: false }
  );
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(fullText);
  const [displayText, setDisplayText] = React.useState(fullText);

  async function handleReaction(type) {
      const res = await fetch('/api/response/reaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ responseAuthor: author, reactionType: type }),
      });
      if (res.ok) {
          const updated = await res.json();
          setReactions(updated);
          setUserReactions(updated.userReacted);
      }
  }

  async function handleEditSave() {
    if (onEdit) {
        await onEdit(editText);
        setDisplayText(editText);
        setIsEditing(false);
    }
  }

  return (
      <div className="response">
          <div className="responseAuthorContainer">
              <span className="responseAuthor">{author}</span> wrote:
          </div>
          <div className="responseText">
              {isEditing ? (
                  <div>
                      <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={5}
                          style={{ width: '100%' }}
                      />
                      <button onClick={handleEditSave} disabled={!editText.trim()}>Save</button>
                      <button onClick={() => { setEditText(displayText); setIsEditing(false); }}>Cancel</button>
                  </div>
              ) : (
                  <details>
                      <summary>"{displayText?.substring(0, 50) || "No response found"}..."</summary>
                      <div className="fullText">{displayText || "No response found."}</div>
                  </details>
              )}
          </div>
          <div className="reactionPanel">
              <button className="reactButton" onClick={() => handleReaction('like')}>
                  {userReactions.like ? '💗 Liked' : '🩷 Like'} <span className="reactionCount">{reactions.likeCount}</span>
              </button>
              <button className="reactButton" onClick={() => handleReaction('laugh')}>
                  {userReactions.laugh ? '🤣 Laughed' : '😂 Laugh'} <span className="reactionCount">{reactions.laughCount}</span>
              </button>
              <button className="reactButton" onClick={() => handleReaction('cry')}>
                  {userReactions.cry ? '😭 Cried' : '😢 Cry'} <span className="reactionCount">{reactions.cryCount}</span>
              </button>
              {isAuthor && !isEditing && (
                  <button className="reactButton" onClick={() => setIsEditing(true)}>✏️ Edit</button>
              )}
              <CritiqueSection
                  author={author}
                  critiques={critiques}
                  currentUser={currentUser}
              />
          </div>
      </div>
  );
}