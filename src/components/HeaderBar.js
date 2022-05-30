import { gql, useQuery, useReactiveVar } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { isLoggedInvar, logUserOut } from '../apollo';
import routes from './../routes';
import Avatar from './auth/Avatar';
import { TOKEN } from '../apollo';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPenToSquare,
  faRightToBracket,
} from '@fortawesome/free-solid-svg-icons';

const HeaderBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: fixed;
  top: 0px;
  padding: 24px;
  color: #000000;
  background-color: #ffffff;
  z-index: 999;
  a {
    :visited {
      color: #000000;
    }
  }
`;

const Logo = styled.div`
  cursor: pointer;
  font-size: 36px;
  font-weight: 700;
  font-family: 'Gugi';
`;

const InfoBox = styled.div`
  display: flex;
  align-items: center;
`;

const IconButton = styled.div`
  cursor: pointer;
  color: ${(props) => (props.changeColor ? props.theme.green : '#1f2937')};
  margin-left: 24px;
  svg {
    font-size: 25px;
    margin-right: 5px;
  }
`;

const ButtonsBox = styled.div``;

const Button = styled.span`
  font-size: 20px;
  font-weight: 400;
`;

const INFO_QUERY = gql`
  query seeProfile {
    seeProfile {
      avatar
    }
  }
`;

function HeaderBar() {
  const [changeNewShoptoGreen, setChangeNewShoptoGreen] = useState('');
  const [changeLogintoGreen, setChangeLogintoGreen] = useState('');
  const navigate = useNavigate();
  const isLogged = useReactiveVar(isLoggedInvar);
  const { data } = useQuery(INFO_QUERY, {
    context: {
      headers: {
        token: localStorage.getItem(TOKEN),
      },
    },
  });

  return (
    <HeaderBox>
      <Link to={routes.home}>
        <Logo>
          <span>modu</span>
        </Logo>
      </Link>
      <ButtonsBox>
        {isLogged ? (
          <InfoBox>
            <Avatar url={data?.seeProfile?.avatar} />
            <Button onClick={() => logUserOut()}>로그아웃</Button>
          </InfoBox>
        ) : (
          <InfoBox>
            <IconButton
              onClick={() => navigate(routes.createShop)}
              changeColor={changeNewShoptoGreen}
              onMouseOver={() => setChangeNewShoptoGreen(true)}
              onMouseLeave={() => setChangeNewShoptoGreen(false)}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
              <Button>새 글 쓰기</Button>
            </IconButton>
            <IconButton
              onClick={() => navigate(routes.login)}
              changeColor={changeLogintoGreen}
              onMouseOver={() => setChangeLogintoGreen(true)}
              onMouseLeave={() => setChangeLogintoGreen(false)}
            >
              <FontAwesomeIcon icon={faRightToBracket} />
              <Button>로그인</Button>
            </IconButton>
          </InfoBox>
        )}
      </ButtonsBox>
    </HeaderBox>
  );
}
export default HeaderBar;
