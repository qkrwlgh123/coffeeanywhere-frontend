import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  height: 150vh;
`;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 1300px;
  justify-content: center;
`;
function HomeLayout({ children }) {
  return (
    <Container>
      <Wrapper>{children}</Wrapper>
    </Container>
  );
}
export default HomeLayout;
