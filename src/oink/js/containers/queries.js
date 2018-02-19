import gql from 'graphql-tag';

const getCurrentUser = gql`
  query GetCurrentUser {
    CurrentUser
  }
`;
const loginUser = gql`
  query loginUser($login: String!, $pass: String!) {
    Login (login: $login, pass: $pass)
  }
`;
const logoutUser = gql`
  query LogoutUser {
    Logout
  }
`;

export {
  getCurrentUser,
  loginUser,
  logoutUser,
};
