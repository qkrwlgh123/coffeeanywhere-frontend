import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  makeVar,
} from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';

export const TOKEN = 'token';
export const DARK_MODE = 'DARK_MODE';

export const isLoggedInvar = makeVar(Boolean(localStorage.getItem(TOKEN)));
export const logUserIn = (token) => {
  localStorage.setItem(TOKEN, token);
  isLoggedInvar(true);
};

export const logUserOut = () => {
  localStorage.removeItem(TOKEN);
  isLoggedInvar(false);
};

export const darkModeVar = makeVar(localStorage.getItem(DARK_MODE));

export const enableDarkMode = () => {
  localStorage.setItem(DARK_MODE, 'enabled');
  darkModeVar(true);
};

export const disableDarkMode = () => {
  localStorage.removeItem(DARK_MODE, 'enabled');
  darkModeVar(false);
};

const uploadLink = createUploadLink({
  uri: 'http://localhost:4000/graphql',
});

export const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
  link: ApolloLink.from([uploadLink]),
});
