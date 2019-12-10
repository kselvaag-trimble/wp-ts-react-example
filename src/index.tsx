import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TokenProvider } from './TokenProvider';
import { TidSettings } from './tidSettings';
import { User } from './types';
import store from './store/store';
import UserView from './components/UserView';
import { Provider } from 'react-redux';
import { signInUser } from './store/user/actions';

const onDocumentReady = () => {
  const appDiv = document.createElement('div');
  document.body.appendChild(appDiv);

  ReactDOM.render(
    <Provider store={store}>
      <UserView />
    </Provider>, 
    appDiv
  );

  const updateApiTokens = (user: User) => {
    console.log("received new tokens, updating API clients");
    store.dispatch(signInUser(user))
  }

  const tokenProvider = new TokenProvider(TidSettings);

  tokenProvider.signIn(updateApiTokens);
}

if (document.readyState !== 'complete') {
  document.addEventListener('DOMContentLoaded', onDocumentReady);
} else {
  onDocumentReady();
}
