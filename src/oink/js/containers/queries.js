import gql from 'graphql-tag';

export const getCurrentUser = gql`
  query GetCurrentUser {
    CurrentUser
  }
`;
export const loginUser = gql`
  query loginUser($login: String!, $pass: String!) {
    Login (login: $login, pass: $pass)
  }
`;
export const logoutUser = gql`
  query LogoutUser {
    Logout
  }
`;

