import React from 'react';
import { MessageDialog } from './messageDialog';

export function Unauthenticated(props) {
  const [userName, setUserName] = React.useState(props.userName ?? '');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [displayError, setDisplayError] = React.useState(null);
  const [isCreating, setIsCreating] = React.useState(false);

  // updated login to use service endpoints
  async function loginUser() {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: userName, password: password }),
    });

    if (response.ok) {
      const body = await response.json();
      localStorage.setItem('userName', body.username);
      props.onLogin(body.username);
    } else {
      const body = await response.json();
      setDisplayError(body.msg);
    }
  }

  //updated create to use service endpoints
  async function createUser() {
    const response = await fetch('/api/auth/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: userName, email: email, password: password }),
    });

    if (response.ok) {
      const body = await response.json();
      localStorage.setItem('userName', body.username);
      props.onLogin(body.username);
    } else {
      const body = await response.json();
      setDisplayError(body.msg);
    }
  }

  return (
    <>
      <div className="loginPrompt">
        <h2>Log in to get started:</h2>
        <div className="mb-3">
          <label htmlFor="usernameInput" className="form-label">username:</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder='username'
          />
        </div>
        {isCreating && (
          <div className="mb-3">
          <label htmlFor="emailInput" className="form-label">email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='email'
          />
        </div>
        )}
        <div>
          <label htmlFor="passwordInput" className="form-label">password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
        </div>
        {isCreating ? (
          <button onClick={() => createUser()} disabled={!userName || !email || !password}>
            Create
          </button>
        ) : (
          <button onClick={() => loginUser()} disabled={!userName || !password}>
            Login
          </button>
        )}
        <p className="createToggle">
          {isCreating ? 'Already have an account? ' : 'New here? '}
          <button onClick={() => setIsCreating(!isCreating)}>
              {isCreating ? 'Login' : 'Create Account'}
          </button>
        </p>
      </div>

      <MessageDialog message={displayError} onHide={() => setDisplayError(null)} />
    </>
  );
}
