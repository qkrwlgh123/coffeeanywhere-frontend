import styled from 'styled-components';

export const BaseBox = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  width: 100%;
`;

export const FatLink = styled.span`
  font-weight: 600;
  color: rgb(142, 142, 142);
`;

export const Title = styled.span`
  font-weight: 400;
  font-size: 36px;
  color: #1f2937;
`;

export const ErrorBox = styled.span`
  margin-top: 20px;
  font-weight: 600;
  font-size: 15px;
  color: #ff8a3e;
  display: ${(props) => (props.active ? 'flex' : 'none')};
`;
