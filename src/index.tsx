import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TokenProvider, User } from './TokenProvider';

const App = (props: { user?: User }) => (
  <div>
    {props.user
      ? `Welcome ${props.user.firstName} ${props.user.lastName}`
      : `Redirecting to login page`}
  </div>
);

let user: User | undefined;

const updateApiTokens = (u: User) => {
  user = u;
  console.log("received new tokens, updating API clients");
}

const tokenProvider = new TokenProvider()

tokenProvider.signIn(updateApiTokens)
  .then(() => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', renderApp);
    } else {
      renderApp();
    }
  })

function renderApp() {
  const appDiv = document.createElement('div');
  document.body.appendChild(appDiv);

  ReactDOM.render(<App user={user} />, appDiv);
}