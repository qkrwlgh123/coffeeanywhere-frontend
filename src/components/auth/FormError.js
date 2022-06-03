import styled from 'styled-components';

const SFormError = styled.span`
  color: #ff8a3e;
  font-weight: 600;
  font-size: 16px;
  margin-top: 8px;
`;

function FormError({ message }) {
  return message === '' || !message ? null : <SFormError>{message}</SFormError>;
}
export default FormError;
