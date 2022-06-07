import { gql, useQuery, useReactiveVar } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { isLoggedInvar, logUserOut, NAME } from '../apollo';
import routes from './../routes';
import Avatar from './auth/Avatar';
import { TOKEN } from '../apollo';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPenToSquare,
  faRightToBracket,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';
import { useEffect } from 'react';

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

const LoggedInUserBox = styled.div`
  display: flex;
  align-items: center;
  margin-left: 24px;
  cursor: pointer;
  svg {
    width: 32px;
    height: 32px;
    color: ${(props) =>
      props.changeColor ? props.theme.green : 'rgb(31,41,55)'};
  }
`;

const ModalBox = styled.div`
  position: absolute;
  top: 70px;
  right: 1px;
  padding: 24px;
  width: 220px;
  height: 220px;
  display: ${(props) => (props.activeModal ? 'flex' : 'none')};
  flex-direction: column;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px;
  background-color: #ffffff;
  span {
    color: #1f2937;
    margin-top: 24px;
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
  const navigate = useNavigate();
  const el = useRef();
  const [activeModal, setActiveModal] = useState(false);
  const [changeNewShoptoGreen, setChangeNewShoptoGreen] = useState('');
  const [changeLogintoGreen, setChangeLogintoGreen] = useState('');
  const [changeEllipsistoGreen, setChangeEllipsistoGreen] = useState('');
  const isLogged = useReactiveVar(isLoggedInvar);

  const { data } = useQuery(INFO_QUERY, {
    context: {
      headers: {
        token: localStorage.getItem(TOKEN),
      },
    },
  });

  const handleDeActiveModal = (event) => {
    if (activeModal && (!el.current || !el.current.contains(event.target))) {
      setActiveModal(false);
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleDeActiveModal);
    return () => {
      window.removeEventListener('click', handleDeActiveModal);
    };
  });

  return (
    <HeaderBox>
      <Link to={routes.home}>
        <Logo>
          <span>coffee</span>
        </Logo>
      </Link>
      <ButtonsBox>
        {isLogged ? (
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
            <LoggedInUserBox
              changeColor={changeEllipsistoGreen}
              onMouseOver={() => setChangeEllipsistoGreen(true)}
              onMouseLeave={() => setChangeEllipsistoGreen(false)}
              onClick={() => setActiveModal((current) => !current)}
            >
              <Avatar url={data?.seeProfile?.avatar} />
              <FontAwesomeIcon icon={faEllipsisVertical} />
              <ModalBox activeModal={activeModal} ref={el}>
                <Button onClick={() => navigate(routes.myList)}>내 목록</Button>
                <Button onClick={() => navigate(routes.myLikeList)}>
                  관심 목록
                </Button>
                <Button onClick={() => navigate()}>프로필 수정</Button>
                <Button onClick={() => logUserOut()}>로그아웃</Button>
              </ModalBox>
            </LoggedInUserBox>
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
