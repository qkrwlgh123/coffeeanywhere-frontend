import { BrowserRouter as Router, Route, Navigate } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import { darkModeVar, isLoggedInvar } from './apollo';
import Home from './screens/Home';
import Login from './screens/Login';
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme, GlobalStyles } from './styles';

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInvar);
  const darkMode = useReactiveVar(darkModeVar);
  return (
    <div>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <GlobalStyles />
        <Router>
          <Routes>
            <Route
              path="/home"
              element={isLoggedIn ? <Home /> : <Login />}
            ></Route>
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
