import React from 'react';

export function CritiqueSection({ initialCritiques, currentUser }) {
  const [critiques, setCritiques] = React.useState(initialCritiques || []);
  const [newCritique, setNewCritique] = React.useState('');
  const [showCritiques, setShowCritiques] = React.useState(false);

  function handleCritiqueSubmit() {
    if (newCritique.trim()) {
      setCritiques(prev => [...prev, { author: currentUser, text: newCritique }]);
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
                    {critiques.map((critique, index) => (
                    <div className="critique" key={index}>
                        <div className="critiqueAuthor">{critique.author}</div>
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