import styled from 'styled-components';

const Button = styled.input`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 400;
  width: 20%;
  padding: 10px 8px;
  margin: 30px 0px;
  font-size: 18px;
  border-radius: 8px;
  color: ${(props) =>
    props.disabled ? 'rgb(75, 85, 99)' : 'rgb(229, 231, 235)'};
  background-color: ${(props) =>
    props.disabled ? 'rgb(209, 213, 219)' : '#475569'};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

export default Button;
