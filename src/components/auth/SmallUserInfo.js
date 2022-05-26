import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Avatar from './Avatar';

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  a {
    color: black;
  }
  a:visited {
    color: black;
  }
`;

const User = styled.div`
  font-size: 16px;
  color: #1f2937;
  font-weight: 400;
  margin-left: 8px;
`;
function SmallUserInfo({ url, username }) {
  return (
    <Link to={`/profile/${username}`}>
      <UserInfo>
        <Avatar url={url} />
        <User>{username}</User>
      </UserInfo>
    </Link>
  );
}

export default SmallUserInfo;
