import { gql, useQuery, useReactiveVar } from '@apollo/client';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { isLoggedInvar, logUserOut } from '../apollo';
import routes from './../routes';
import Avatar from './auth/Avatar';
import { TOKEN } from '../apollo';
import { useState } from 'react';

const HeaderBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: fixed;
  top: 0px;
  padding: 30px 50px;
  color: white;
  background-color: black;
  z-index: 999;
  a {
    :visited {
      color: white;
    }
  }
`;

const Logo = styled.div`
  cursor: pointer;
  font-size: 18px;
  margin-left: 250px;
`;

const InfoBox = styled.div`
  display: flex;
  align-items: center;
  margin-right: 120px;
  width: 190px;
  height: 20px;
  div {
    margin-right: 30px;
  }
`;

const ButtonsBox = styled.div`
  margin-right: 80px;
`;

const Button = styled.span`
  cursor: pointer;
  font-size: 18px;
  margin: 0px 20px;
`;

const INFO_QUERY = gql`
  query seeProfile {
    seeProfile {
      avatar
    }
  }
`;

function HeaderBar() {
  const isLogged = useReactiveVar(isLoggedInvar);
  const [profileImg, setProfileImg] = useState('');
  const { data } = useQuery(INFO_QUERY, {
    context: {
      headers: {
        token: localStorage.getItem(TOKEN),
      },
    },
    onCompleted: () => setProfileImg(data?.seeProfile?.avatar),
  });

  return (
    <HeaderBox>
      <Link to={routes.home}>
        <Logo>
          <span>로고</span>
        </Logo>
      </Link>
      <ButtonsBox>
        {isLogged ? (
          <InfoBox>
            <Avatar url={profileImg} />
            <Button onClick={() => logUserOut()}>로그아웃</Button>
          </InfoBox>
        ) : (
          <InfoBox>
            <Link to={routes.login}>
              <Button>로그인</Button>
            </Link>
            <Link to={routes.signUp}>
              <Button>회원가입</Button>
            </Link>
          </InfoBox>
        )}
      </ButtonsBox>
    </HeaderBox>
  );
}
export default HeaderBar;
