import React from 'react';
import { MessageDialog } from './messageDialog';

export function Unauthenticated(props) {
  const [userName, setUserName] = React.useState(props.userName);
  const [password, setPassword] = React.useState('');
  const [displayError, setDisplayError] = React.useState(null);

  async function loginUser() {
    localStorage.setItem('userName', userName);
    props.onLogin(userName);
  }

  async function createUser() {
    localStorage.setItem('userName', userName);
    props.onLogin(userName);
  }

  return (
    <>
      <div className="loginPrompt">
        <h2>Log in to get started:</h2>
        <form method="get" action="prompt">
          <div className="mb-3">
            <label htmlFor="usernameInput" className="form-label">username:</label>
            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder='username' />
          </div>
          <div>
            <label htmlFor="passwordInput" className="form-label">password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
          </div>
          <button onClick={() => loginUser()} disabled={!userName || !password}>
            Login
          </button>
          <button onClick={() => createUser()} disabled={!userName || !password}>
            Create
          </button>
        </form>
      </div>

      <MessageDialog message={displayError} onHide={() => setDisplayError(null)} />
    </>
  );
}
