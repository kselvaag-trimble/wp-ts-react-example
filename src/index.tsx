import * as React from 'react';
import * as ReactDOM from 'react-dom';

const App = () => <div>Hello, World!</div>;

document.addEventListener("DOMContentLoaded", async () => {
  const appDiv = document.createElement('div');
  document.body.appendChild(appDiv);

  ReactDOM.render(<App />, appDiv);
})
