import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Prompt } from './prompt/prompt';
import { Feed } from './feed/feed';
import { Profile } from './profile/profile';
import { About } from './about/about';

export default function App() {
  return (
    <BrowserRouter>
        <div className="app">
            <header>
                <h1 className="banner">
                  <img className="bannerImage" src="bannerBookworm.jpg" alt="Bookworms Banner"/>
                  <span className="wavy">Bookworms</span>
                </h1>
                <nav>
                    <menu>
                      <div className="navButtonContainer"><NavLink className="navButton" to= "">Home</NavLink></div>
                      <div className="navButtonContainer"><NavLink className="navButton" to="/prompt">Prompt</NavLink></div>
                      <div className="navButtonContainer"><NavLink className="navButton" to= "/feed">Response Feed</NavLink></div>
                      <div className="navButtonContainer"><NavLink className="navButton" to= "/profile">Profile</NavLink></div>
                      <div className="navButtonContainer"><NavLink className="navButton" to= "/about">About</NavLink></div>
                    </menu>
                </nav>
            </header>

            <Routes>
                <Route path='/' element={<Login />} exact />
                <Route path='/prompt' element={<Prompt />} />
                <Route path='/feed' element={<Feed />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/about' element={<About />} />
                <Route path='*' element={<NotFound />} />
            </Routes>

            <footer>
              <div className="text-reset">Abigail Peterson</div>
              <a
                className="btn btn-outline-light btn-sm"
                href="https://github.com/abbiesue/Bookworms"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </footer>
        </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}