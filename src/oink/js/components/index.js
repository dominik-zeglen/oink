import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

const renderApp = () => {
  ReactDOM.render(<App
    favourites={[]}
    rootPath={'/manage'}
  />, document.getElementById('oink-app'));
};

export default renderApp;