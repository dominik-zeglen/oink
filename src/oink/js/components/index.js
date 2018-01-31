import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import App from './App';
import rootReducer from '../reducers';

injectTapEventPlugin();

const store = createStore(rootReducer);
const apolloCache = new InMemoryCache();
const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: '/manage/graphql' }),
  cache: apolloCache,
});

function renderApp() {
  ReactDOM.render(
    <Provider store={store}>
      <ApolloProvider client={apolloClient}>
        <BrowserRouter>
          <MuiThemeProvider>
            <App favourites={[]} rootPath="/manage" />
          </MuiThemeProvider>
        </BrowserRouter>
      </ApolloProvider>
    </Provider>,
    document.getElementById('oink-app'),
  );
}

export default renderApp;
