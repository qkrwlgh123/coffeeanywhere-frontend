import styled from 'styled-components';
import Avatar from './Avatar';

const UserInfo = styled.div``;

const User = styled.div`
  font-size: 14px;
  font-weight: 400;
  margin-top: 10px;
`;
function SmallUserInfo({ url, username }) {
  return (
    <UserInfo>
      <Avatar url={url} />
      <User>{username}</User>
    </UserInfo>
  );
}

export default SmallUserInfo;
