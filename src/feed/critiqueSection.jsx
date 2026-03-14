import React from 'react';

export function CritiqueSection({ author, critiques, currentUser }) {
  const [critiqueList, setCritiqueList] = React.useState(critiques || []);
  const [newCritique, setNewCritique] = React.useState('');
  const [showCritiques, setShowCritiques] = React.useState(false);

  async function handleCritiqueSubmit() {
      if (!newCritique.trim()) return;
      const res = await fetch('/api/response/critique', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ responseAuthor: author, critiqueText: newCritique }),
      });
      if (res.ok) {
          const updated = await res.json();
          setCritiqueList(updated);
          setNewCritique('');
      }
  }

  return (
    <>
      <button className="reactButton" onClick={() => setShowCritiques(!showCritiques)}>
        💬 Critiques
      </button>
      {showCritiques && (
        <div style={{width: "100%"}}>
            <div className="critiqueFeed">
                <div className="existingCritiques">
                    <h4>Critiques:</h4>
                    {critiqueList.map((critique, index) => (
                    <div className="critique" key={index}>
                        <div className="critiqueAuthor">{critique.username}</div>
                        <div className="critiqueText">{critique.text}</div>
                    </div>
                    ))}
                </div>
                <div className="addCritique">
                    <h4>Add a critique:</h4>
                    <textarea
                        className="critiqueInput"
                        rows="3"
                        placeholder="Write your critique here..."
                        value={newCritique}
                        onChange={(e) => setNewCritique(e.target.value)}
                    />
                    <button
                        className="submitCritique"
                        onClick={handleCritiqueSubmit}
                        disabled={!newCritique.trim()}
                    >
                        Post Critique
                    </button>
                </div>
            </div>
        </div>
        
      )}
    </>
  );
}