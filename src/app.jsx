import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes, useNavigate} from 'react-router-dom';
import { Login } from './login/login';
import { Prompt } from './prompt/prompt';
import { Feed } from './feed/feed';
import { Profile } from './profile/profile';
import { About } from './about/about';
import { AuthState } from './login/authState';
import { ResponseState } from './profile/responseState';

export default function App() {
  const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
  const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
  const [authState, setAuthState] = React.useState(currentAuthState);
  const [responseState, setResponseState] = React.useState(
    localStorage.getItem(`responseState_${userName}`) === 'responded'
      ? ResponseState.Responded
      : ResponseState.NotResponded
  );


  return (
    <BrowserRouter>
        <div className="app">
            <header>
                <h1 className="banner">
                  <img className="bannerImage" src="bannerBookworm.jpg" alt="Bookworms Banner"/>
                  <span className="wavy">Bookworms</span>
                </h1>
                {authState === AuthState.Authenticated && (
                  <LogoutButton
                    userName={userName}
                    onLogout={() => {
                      localStorage.removeItem('userName');
                      setUserName('');
                      setAuthState(AuthState.Unauthenticated);
                    }}
                  />
                )}
                <nav>
                    <menu>
                      {authState === AuthState.Unauthenticated && (
                        <div className="navButtonContainer"><NavLink className="navButton" to= "">Login</NavLink></div>
                      )}
                      {authState === AuthState.Authenticated && (
                        <>
                          {responseState === ResponseState.NotResponded && (
                            <div className="navButtonContainer"><NavLink className="navButton" to="/prompt">Prompt</NavLink></div>
                          )}
                          {responseState === ResponseState.Responded && (
                            <div className="navButtonContainer"><NavLink className="navButton" to="/feed">Response Feed</NavLink></div>
                          )}
                          <div className="navButtonContainer"><NavLink className="navButton" to="/profile">Profile</NavLink></div>
                        </>
                      )}
                      <div className="navButtonContainer"><NavLink className="navButton" to= "/about">About</NavLink></div>
                    </menu>
                </nav>
            </header>

            <Routes>
              <Route
                path='/'
                element={
                  <Login
                    userName={userName}
                    authState={authState}
                    responseState={responseState}
                    onAuthChange={(newUserName, newAuthState) => {
                      setAuthState(newAuthState);
                      setUserName(newUserName);
                      setResponseState(
                        localStorage.getItem(`responseState_${newUserName}`) === 'responded'
                          ? ResponseState.Responded
                          : ResponseState.NotResponded
                      );
                    }}
                  />
                } exact />
               <Route path='/prompt' element={
                  <Prompt 
                  responseState={responseState} 
                  userName={userName} 
                  onRespond={() => {
                    setResponseState(ResponseState.Responded);
                  }} />
                } />
              <Route path='/feed' element={<Feed userName={userName} />} />
              <Route path='/profile' element={<Profile username={userName} streak={5} totalBonuses={57} totalCritiques={18} />} />
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

function LogoutButton({ userName, onLogout }) {
  const navigate = useNavigate();
  return (
    <button className="userDisplay" onClick={() => {
      onLogout();
      navigate('/');
    }}>
      logout {userName}
    </button>
  );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}