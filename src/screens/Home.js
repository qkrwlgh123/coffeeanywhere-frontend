import styled from 'styled-components';
import { isLoggedInvar, darkModeVar } from '../apollo';

const Title = styled.h1`
  color: ${(props) => props.theme.fontColor};
`;

const Container = styled.div`
  background-color: ${(props) => props.theme.bgColor};
`;

function Home() {
  return (
    <Container>
      <Title>Home</Title>
      <button onClick={() => isLoggedInvar(false)}>Log out!</button>
      <button onClick={() => darkModeVar((current) => !current)}>
        Change to Dark mode
      </button>
    </Container>
  );
}
export default Home;
