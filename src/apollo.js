import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';

export const TOKEN = 'token';
export const NAME = 'name';
export const DARK_MODE = 'DARK_MODE';

export const isLoggedInvar = makeVar(Boolean(localStorage.getItem(TOKEN)));

export const logUserIn = (token, name) => {
  localStorage.setItem(TOKEN, token);
  localStorage.setItem(NAME, name);
  isLoggedInvar(true);
};

export const logUserOut = () => {
  localStorage.removeItem(TOKEN);
  localStorage.removeItem(NAME);
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

const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === 'production'
      ? 'https://nomadcoffee-backend-jiho.herokuapp.com/graphql'
      : 'http://localhost:4000/graphql',
});
const uploadLink = createUploadLink({
  uri:
    process.env.NODE_ENV === 'production'
      ? 'https://nomadcoffee-backend-jiho.herokuapp.com/graphql'
      : 'http://localhost:4000/graphql',
});

export const client = new ApolloClient({
  uri: ApolloLink.from([httpLink]),
  cache: new InMemoryCache(),
  link: ApolloLink.from([uploadLink]),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
  },
});
