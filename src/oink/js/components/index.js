import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

const renderApp = () => {
  ReactDOM.render(<App
    favourites={[{link: 'xd', label: 'xDD'}]}
    rootPath={'/manage'}
  />, document.getElementById('oink-app'));
};

export default renderApp;