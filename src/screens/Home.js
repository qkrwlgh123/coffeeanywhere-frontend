import { logUserOut, TOKEN } from '../apollo';
import { Link, useNavigate } from 'react-router-dom';
import routes from '../routes';
import HomeLayout from '../components/shop/HomeLayout';
import { BaseBox, FatLink, Title } from '../components/shared';
import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';
import Button from '../components/auth/Button';
import PageTitle from '../components/PageTitle';
import { History } from 'history';
import { useEffect, useState } from 'react';

export const HomeBox = styled(BaseBox)`
  display: flex;
  flex-direction: column;
  margin-top: 5%;
  align-items: center;
  padding: 15px;
  width: 80%;
  height: 80%;
  border: none;
`;

const Shops = styled.div`
  display: grid;
  /* Media Query for Laptops and Desktops */
  @media (min-width: 1025px) {
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 20px;
  }
  /* Media Query for Tablet */
  @media (min-width: 651px) and (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px;
  }
  /* Media Query for Mobile */
  @media (max-width: 650px) {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;
  }
`;

const CoffeeShop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid ${(props) => props.theme.borderColor};
  width: 100%;
  height: 100%;
  max-width: 230px;
  max-height: 300px;
  a {
    color: inherit;
    margin: 20px 0px;
    font-size: 20px;
    :visited {
      color: inherit;
    }
  }
`;

const EmptyBox = styled.div`
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
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
      photos {
        url
      }
    }
  }
`;

function Home() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);

  const { loading, error, data, refetch } = useQuery(LIST_QUERY, {
    context: {
      headers: {
        token: localStorage.getItem(TOKEN),
      },
    },
    onCompleted: () => setList(data),
  });

  return (
    <HomeLayout>
      <PageTitle title="My list" />
      <HomeBox>
        {list?.seeMyShopList?.length > 0 ? (
          <Shops>
            {list.seeMyShopList.map((item) => (
              <CoffeeShop key={item.id}>
                <Link to={`${item.id}`}>{item.name}</Link>
                {item.photos.length > 0 ? (
                  <img src={item.photos[0]?.url} />
                ) : (
                  <EmptyBox>
                    <span>Add a photo!</span>
                  </EmptyBox>
                )}
              </CoffeeShop>
            ))}
          </Shops>
        ) : null}
        <Link to={routes.createShop}>
          <Addbtn>Add a Shop!</Addbtn>
        </Link>
      </HomeBox>
    </HomeLayout>
  );
}
export default Home;
