import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponseState } from '../profile/responseState';
import './prompt.css'

export function Prompt(props) {
  const navigate = useNavigate();
  const [bonuses, setBonuses] = React.useState([
    'use the word "intergalactic"',
    "set in the future",
    "make one character a cowboy",
  ]);
  const [response, setResponse] = React.useState('');
  const [alreadyResponded, setAlreadyResponded] = React.useState(false);

  React.useEffect(() => {
    if (props.responseState === ResponseState.Responded) {
      setAlreadyResponded(true);
    }
  }, []);

  function handlePublish() {
    localStorage.setItem(`responseState_${props.userName}`, 'responded');
    localStorage.setItem(`response_${props.userName}`, response);
    props.onRespond();
    navigate('/feed');
  }

  return (
    <main>
      <div className="promptContainer" id="dropFirst">
        <h1>~Daily Prompt~</h1>
        <p>"{props.dailyPrompt}"</p>
      </div>
      <div className="bonusContainer" id="dropSecond">
        <h3><span>daily bonuses:</span></h3>
        {bonuses.map((bonus, index) => (
          <p key={index}>⭐️ {bonus}</p>
        ))}
      </div>
      <div className="responseForm" id="dropThird">
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="type here..."
        />
        <button onClick={handlePublish} disabled={!response}>Publish</button>
      </div>

      {alreadyResponded && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                You have already responded to today's prompt! You will be redirected to the response feed.
              </div>
              <div className="modal-footer">
                <button onClick={() => navigate('/feed')}>Go to Feed</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}