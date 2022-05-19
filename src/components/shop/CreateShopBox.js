import styled from 'styled-components';
import { BaseBox } from '../shared';

const Container = styled(BaseBox)`
  display: flex;
  padding: 35px 40px 25px 40px;
  margin-bottom: 10px;
  border: none;
  form {
    margin-top: 35px;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
`;

function CreateShopBox({ children }) {
  return <Container>{children}</Container>;
}
export default CreateShopBox;
