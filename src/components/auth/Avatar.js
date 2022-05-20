import styled from 'styled-components';
import { faUser } from '@fortawesome/free-regular-svg-icons'; // ♡
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AvatarBox = styled.div``;

const AvatarImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 30px;
`;

const NoneAvatar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border: 1px solid rgb(219, 219, 219);
  background-color: rgb(250, 250, 250);
  border-radius: 30px;
`;

function Avatar({ url }) {
  return (
    <AvatarBox>
      {url ? (
        <AvatarImg src={url} />
      ) : (
        <NoneAvatar>
          <FontAwesomeIcon icon={faUser} size="2x" color="rgb(128,128,128)" />
        </NoneAvatar>
      )}
    </AvatarBox>
  );
}
export default Avatar;
