import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  form {
    margin-top: 35px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

function FormBox({ children }) {
  return <Container>{children}</Container>;
}
export default FormBox;
