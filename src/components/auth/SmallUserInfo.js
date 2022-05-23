import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Avatar from './Avatar';

const UserInfo = styled.div`
  a {
    color: black;
  }
  a:visited {
    color: black;
  }
`;

const User = styled.div`
  font-size: 14px;
  font-weight: 400;
  margin-top: 10px;
`;
function SmallUserInfo({ url, username }) {
  return (
    <UserInfo>
      <Link to={`/profile/${username}`}>
        <Avatar url={url} />
        <User>{username}</User>
      </Link>
    </UserInfo>
  );
}

export default SmallUserInfo;
