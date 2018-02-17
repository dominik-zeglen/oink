import React from 'react';
import { createStore } from 'redux';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';
import { CookiesProvider } from 'react-cookie';
import Reboot from 'material-ui/Reboot';

import Nav from './containers/Nav';
import AppRouter from './containers/AppRouter';
import Breadcrumbs from './containers/Breadcrumbs';
import reducers from './reducers';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
  overrides: {
    MuiFormControl: {
      root: {
        marginBottom: '1rem',
      },
    },
    MuiCardActions: {
      root: {
        flexDirection: 'row-reverse',
      },
    },
  },
});
const store = createStore(reducers);
const client = new ApolloClient({
  link: new HttpLink({
    uri: '/manage/graphql',
    credentials: 'same-origin',
  }),
  cache: new InMemoryCache(),
});
const styles = {
  content: {
    margin: 'auto',
    maxWidth: '1200px',
    width: '100%',
  },
};
function renderApp() {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <BrowserRouter basename="/manage">
          <CookiesProvider>
            <MuiThemeProvider theme={theme}>
              <Reboot />
              <Nav />
              <div style={styles.content}>
                <Breadcrumbs />
                <AppRouter />
              </div>
            </MuiThemeProvider>
          </CookiesProvider>
        </BrowserRouter>
      </ApolloProvider>
    </Provider>
  );
}

render(renderApp(), document.getElementById('oink-app'));

