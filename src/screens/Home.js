import { TOKEN } from '../apollo';
import { Link } from 'react-router-dom';
import routes from '../routes';
import HomeLayout from '../components/shop/HomeLayout';
import { BaseBox } from '../components/shared';
import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';

import PageTitle from '../components/PageTitle';

import { useState } from 'react';

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
  const [list, setList] = useState([]);

  const { data } = useQuery(LIST_QUERY, {
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
    </HomeLayout>
  );
}
export default Home;
