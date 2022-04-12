import styled from 'styled-components';
import { isLoggedInvar, darkModeVar, logUserOut } from '../apollo';
import { useNavigate } from 'react-router-dom';
import routes from '../routes';

const Title = styled.h1`
  color: ${(props) => props.theme.fontColor};
`;

const Container = styled.div`
  background-color: ${(props) => props.theme.bgColor};
`;

function Home() {
  const navigate = useNavigate();
  return (
    <Container>
      <Title>Welcome! YOu did it!</Title>
      <button
        onClick={() => (
          logUserOut(),
          navigate(routes.home, {
            replace: true,
          })
        )}
      >
        Log out!
      </button>
    </Container>
  );
}
export default Home;
