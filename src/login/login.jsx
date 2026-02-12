import React from 'react';
import './login.css'

export function Login() {
  return (
    <main>
      <h1>
        Welcome to
        <span className="wavy">Bookworms</span>
      </h1>
      <div className="loginPrompt">
        <h2>Log in to get started:</h2>
        <form method="get" action="prompt">
          <div className="mb-3">
            <label htmlFor="emailInput" className="form-label">email:</label>
            <input type="text" placeholder="your@email.com" />
          </div>
          <div>
            <label htmlFor="passwordInput" className="form-label">password:</label>
            <input type="password" placeholder="password" />
          </div>
          <button type="submit">Login</button>
          <button type="submit">Create</button>
        </form>
      </div>

    </main>
  );
}