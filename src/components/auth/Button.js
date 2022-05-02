import styled from 'styled-components';

const Button = styled.input`
  border: none;
  margin-top: 25px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.accent};
  color: white;
  text-align: center;
  padding: 8px 0px;
  font-size: 18px;
  font-weight: 600;
  width: 50%;
  cursor: pointer;
  opacity: ${(props) => (props.disabled ? '0.2' : 1)};
`;

export default Button;
