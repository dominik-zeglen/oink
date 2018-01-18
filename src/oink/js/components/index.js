import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import App from './app';
import rootReducer from '../reducers';

injectTapEventPlugin();

const store = createStore(rootReducer);

function renderApp() {
  ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider>
        <BrowserRouter>
          <App favourites={[]} rootPath="/manage" />
        </BrowserRouter>
      </MuiThemeProvider>
    </Provider>,
    document.getElementById('oink-app'),
  );
}

export default renderApp;
