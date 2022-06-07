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
import PublicList from './screens/PublicList';
import HeaderBar from './components/HeaderBar';
import MyLikeList from './screens/MyLikeList';
import Profile from './screens/Profile';
import MyShops from './screens/MyShops';

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInvar);
  const darkMode = useReactiveVar(darkModeVar);
  return (
    <ApolloProvider client={client}>
      <HelmetProvider>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <GlobalStyles />
          <Router>
            <HeaderBar />
            <Routes>
              <Route path={routes.home} element={<PublicList />}></Route>
              <Route
                path={routes.login}
                element={isLoggedIn ? <PublicList /> : <Login />}
              ></Route>
              <Route
                path={routes.signUp}
                element={
                  !isLoggedIn ? (
                    <SignUp />
                  ) : (
                    <Navigate to={routes.home} replace />
                  )
                }
              ></Route>
              <Route
                path={routes.createShop}
                element={
                  isLoggedIn ? (
                    <CreateShop />
                  ) : (
                    <Navigate to={routes.login} replace />
                  )
                }
              ></Route>
              <Route path={routes.shopInfo} element={<ShopInfo />}></Route>
              <Route
                path={routes.editShop}
                element={
                  isLoggedIn ? (
                    <EditShop />
                  ) : (
                    <Navigate to={routes.login} replace />
                  )
                }
              ></Route>
              <Route path={routes.publiclist} element={<PublicList />}></Route>
              <Route path={routes.myList} element={<MyShops />}></Route>
              <Route path={routes.myLikeList} element={<MyLikeList />}></Route>
              <Route path={routes.profile} element={<Profile />}></Route>
              <Route path="*" element={<Navigate to={routes.home} replace />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </HelmetProvider>
    </ApolloProvider>
  );
}

export default App;
