import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import Dashboard from './reducers';

import App from './app';

const store = createStore(Dashboard);
const client = new ApolloClient({
  link: new HttpLink({ uri: '/manage/graphql' }),
  cache: new InMemoryCache(),
});

function renderApp() {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <Provider store={store}>
        <App favourites={[]} rootPath="/manage" />
      </Provider>
    </ApolloProvider>,
    document.getElementById('oink-app'),
  );
}

export default renderApp;
