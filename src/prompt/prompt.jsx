import React from 'react';
import './prompt.css'

export function Prompt() {
  return (
    <main>
      <div className="promptContainer" id="dropFirst">
        <h1>~Daily Prompt~</h1>
        <p>"Two friends realize they are characters in a comic; one is the hero, one the villain..."</p>
      </div>
      <div className="bonusContainer" id="dropSecond">
        <h3>
          <span>daily bonuses:</span>
        </h3>
        <p>⭐️ use the word "intergalactic"</p>
        <p>⭐️ set in the future</p>
        <p>⭐️ make one character a cowboy</p>         
      </div>
      <form method="get" action="feed.html" className="responseForm" id="dropThird">
          <input type="text" placeholder="type here..." />
        <button type="submit">Publish</button>
      </form>
    </main>
  );
}