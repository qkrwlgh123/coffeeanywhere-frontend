import { BrowserRouter as Router, Route, Navigate } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import { ApolloProvider, useReactiveVar } from '@apollo/client';
import { client, darkModeVar, isLoggedInvar } from './apollo';
import Home from './screens/Home';
import Login from './screens/Login';
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme, GlobalStyles } from './styles';
import SignUp from './screens/SignUp';
import routes from './routes';
import { HelmetProvider } from 'react-helmet-async';
import CreateShop from './screens/CreateShop';
import ShopInfo from './screens/ShopInfo';
import EditShop from './screens/EditShop';

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInvar);
  const darkMode = useReactiveVar(darkModeVar);
  return (
    <ApolloProvider client={client}>
      <HelmetProvider>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <GlobalStyles />
          <Router>
            <Routes>
              <Route
                path={routes.home}
                element={isLoggedIn ? <Home /> : <Login />}
              ></Route>
              <Route
                path={routes.signUp}
                element={!isLoggedIn ? <SignUp /> : null}
              ></Route>
              <Route
                path={routes.createShop}
                element={
                  isLoggedIn ? (
                    <CreateShop />
                  ) : (
                    <Navigate to={routes.home} replace />
                  )
                }
              ></Route>
              <Route
                path={routes.shopInfo}
                element={
                  isLoggedIn ? (
                    <ShopInfo />
                  ) : (
                    <Navigate to={routes.home} replace />
                  )
                }
              ></Route>
              <Route
                path={routes.editShop}
                element={
                  isLoggedIn ? (
                    <EditShop />
                  ) : (
                    <Navigate to={routes.home} replace />
                  )
                }
              ></Route>
              <Route path="*" element={<Navigate to={routes.home} replace />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </HelmetProvider>
    </ApolloProvider>
  );
}

export default App;
