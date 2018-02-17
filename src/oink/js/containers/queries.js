import gql from 'graphql-tag';

const getCurrentUser = `
  query GetCurrentUser {
    CurrentUser
  }
`;
const loginUser = `
  query loginUser($login: String!, $pass: String!) {
    Login (login: $login, pass: $pass)
  }
`;
const logoutUser = `
  query LogoutUser {
    Logout
  }
`;

export {
  getCurrentUser,
  loginUser,
  logoutUser,
};
