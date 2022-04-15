import { logUserOut, TOKEN } from '../apollo';
import { Link, useNavigate } from 'react-router-dom';
import routes from '../routes';
import HomeLayout from '../components/shop/HomeLayout';
import { BaseBox, FatLink, Title } from '../components/shared';
import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';
import Button from '../components/auth/Button';
import PageTitle from '../components/PageTitle';

export const HomeBox = styled(BaseBox)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 0;
`;

const MyList = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 30px;
`;

const MyShop = styled.li`
  cursor: pointer;
  margin-bottom: 15px;
  font-size: 18px;
`;

const Addbtn = styled.span`
  font-weight: 600;
  margin-top: 20px;
`;

export const LogOut = styled(Button)`
  width: 80px;
  height: 10px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
`;

const LIST_QUERY = gql`
  query seeMyShopList {
    seeMyShopList {
      name
      id
    }
  }
`;

function Home() {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(LIST_QUERY, {
    context: {
      headers: {
        token: localStorage.getItem(TOKEN),
      },
    },
  });

  let list = data;

  return (
    <HomeLayout>
      <PageTitle title="My list" />
      <HomeBox>
        <Title>MY Coffee Shop List</Title>
        {list?.seeMyShopList.length > 0 ? (
          <MyList>
            {list.seeMyShopList.map((item) => (
              <Link key={item.id} to={`${item.id}`} reloadDocument>
                <MyShop key={item.id}>{item.name}</MyShop>
              </Link>
            ))}
            <Link to={routes.createShop}>
              <Addbtn>Add a Shop!</Addbtn>
            </Link>
          </MyList>
        ) : (
          <Link to={routes.createShop}>
            <Addbtn>Add a Shop!</Addbtn>
          </Link>
        )}
        <LogOut
          type="submit"
          value="Log out"
          onClick={() => (
            logUserOut(), navigate(routes.home, { replace: true })
          )}
        />
      </HomeBox>
    </HomeLayout>
  );
}
export default Home;
