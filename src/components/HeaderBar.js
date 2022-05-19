import { useReactiveVar } from '@apollo/client';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { isLoggedInvar, logUserOut } from '../apollo';
import routes from './../routes';

const HeaderBox = styled.div`
  display: flex;
  justify-content: space-between;
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
`;

const ButtonsBox = styled.div`
  margin-right: 80px;
`;

const Button = styled.span`
  cursor: pointer;
  font-size: 18px;
  margin: 0px 20px;
`;

function HeaderBar() {
  const isLogged = useReactiveVar(isLoggedInvar);
  return (
    <HeaderBox>
      <Link to={routes.home}>
        <Logo>
          <span>로고</span>
        </Logo>
      </Link>
      <ButtonsBox>
        {isLogged ? (
          <div>
            <Button>로그인함</Button>
            <Button onClick={() => logUserOut()}>로그아웃</Button>
          </div>
        ) : (
          <div>
            <Link to={routes.login}>
              <Button>로그인</Button>
            </Link>
            <Link to={routes.signUp}>
              <Button>회원가입</Button>
            </Link>
          </div>
        )}
      </ButtonsBox>
    </HeaderBox>
  );
}
export default HeaderBar;
