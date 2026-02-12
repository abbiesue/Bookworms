import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
  return <div className="app">
    <header>
        <h1 className="banner">
          <img className="bannerImage" src="bannerBookworm.jpg" alt="Bookworms Banner"></img>
          <span className="wavy">Bookworms</span>
        </h1>
        <nav>
            <menu>
              <flex className="navButtonContainer"><a className="navButton" href= "index.html">Home</a></flex>
              <flex className="navButtonContainer"><a className="navButton" href="prompts.html">Prompt</a></flex>
              <flex className="navButtonContainer"><a className="navButton" href= "feed.html">Response Feed</a></flex>
              <flex className="navButtonContainer"><a className="navButton" href= "profile.html">Profile</a></flex>
              <flex className="navButtonContainer"><a className="navButton" href= "about.html">About</a></flex>
            </menu>
        </nav>
    </header>

    <main>App components go here.</main>

    <footer>
      <hr />
      <span className="text-reset">Abigail Peterson</span>
      <br />
      <a href="https://github.com/abbiesue/Bookworms">GitHub</a>
    </footer>
  </div>;
}