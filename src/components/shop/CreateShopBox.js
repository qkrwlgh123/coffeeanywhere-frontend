import styled from 'styled-components';
import { BaseBox } from '../shared';

const Container = styled(BaseBox)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 35px 40px 25px 40px;
  margin-bottom: 10px;
  border: none;
  form {
    margin-top: 35px;
    width: 100%;
    display: flex;
    justify-items: center;
    align-items: center;
    flex-direction: column;
  }
`;

function CreateShopBox({ children }) {
  return <Container>{children}</Container>;
}
export default CreateShopBox;
