import styled from 'styled-components';

const SNotification = styled.span`
  color: ${(props) => props.theme.accent};
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 5px;
`;

function Notification({ message }) {
  return message === '' || !message ? null : (
    <SNotification>{message}</SNotification>
  );
}
export default Notification;
