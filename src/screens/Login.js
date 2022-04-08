import { darkModeVar, isLoggedInvar } from '../apollo';
import styled from 'styled-components';

const Title = styled.h1`
  color: ${(props) => props.theme.fontColor};
`;

const Container = styled.div`
  background-color: ${(props) => props.theme.bgColor};
`;

function Login() {
  return (
    <Container>
      <Title>Plz Login</Title>
      <button onClick={() => isLoggedInvar(true)}>Log in!</button>
      <button onClick={() => darkModeVar((current) => !current)}>
        Change to Dark mode
      </button>
    </Container>
  );
}
export default Login;
