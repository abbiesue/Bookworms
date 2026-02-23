import React from 'react';
import './login.css'

import { Unauthenticated } from './unauthenticated';
import { Authenticated } from './authenticated';
import { AuthState } from './authState';

export function Login({ userName, authState, responseState, onAuthChange }) {
  return (
    <main>
      <div>
        {authState !== AuthState.Unknown && <h1>Welcome to <span className="wavy">Bookworms</span></h1>}
        {authState === AuthState.Authenticated && (
          <Authenticated userName={userName} responseState={responseState} onLogout={() => onAuthChange(userName, AuthState.Unauthenticated)} />
        )}
        {authState === AuthState.Unauthenticated && (
            <Unauthenticated
              userName={userName}
              onLogin={(loginUserName) => {
                onAuthChange(loginUserName, AuthState.Authenticated);
              }}
            />
          )}
      </div>
    </main>
  );
}