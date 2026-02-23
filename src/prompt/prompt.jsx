import React from 'react';
import { useNavigate } from 'react-router-dom';
import './prompt.css'

export function Prompt(props) {
  const navigate = useNavigate();
  const [dailyPrompt, setDailyPrompt] = React.useState(
    "(This and bonuses will be retrieved from DB) Two friends realize they are characters in a comic; one is the hero, one the villain..."
  );
  const [bonuses, setBonuses] = React.useState([
    'use the word "intergalactic"',
    "set in the future",
    "make one character a cowboy",
  ]);
  const [response, setResponse] = React.useState('');

  function handlePublish() {
    localStorage.setItem('response', response);
    props.onRespond();
    navigate('/feed');
  }

  return (
    <main>
      <div className="promptContainer" id="dropFirst">
        <h1>~Daily Prompt~</h1>
        <p>"{dailyPrompt}"</p>
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
    </main>
  );
}