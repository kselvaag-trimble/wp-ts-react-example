import * as React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/types';
import CounterView from './CounterView';

const UserView = () => {
  const user = useSelector(selectUser);

  return (
    <div>
      {user
        ? (
          <div>
            Welcome {user.firstName} {user.lastName}
            <button onClick={signOut}>Sign out</button>
            <CounterView label={`${user.firstName}'s counter`} />
          </div>
        )
        : `Redirecting to login page`}
    </div>
  );
}

const selectUser = (state: RootState) => state.user;

const signOut = () => window.location.href = signOutUrl;

const callbackUrl = "http://localhost:8081";
const appName = "example-app-tid-LOCALHOST";
const signOutUrl = `https://identity.trimble.com/i/commonauth?commonAuthLogout=true&type=samlsso&sessionDataKey=E294FEF4A64BF7E14940E2964F78E351&commonAuthCallerPath=${callbackUrl}&relyingParty=${appName}`;

export default UserView;