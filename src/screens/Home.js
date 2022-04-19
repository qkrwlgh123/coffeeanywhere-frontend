import { TOKEN } from '../apollo';
import { Link } from 'react-router-dom';
import routes from '../routes';
import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';
import PageTitle from '../components/PageTitle';
import { useState } from 'react';
import InfoLayout from '../components/shop/InfoLayout';

const ListBox = styled.div`
  display: flex;
  justify-content: center;
  background-color: #ffffff;
  width: 75%;
  margin-top: 10%;
  padding: 15px;
`;

const Shops = styled.div`
  display: grid;
  /* Media Query for Laptops and Desktops */
  @media (min-width: 1025px) {
    grid-template-columns: repeat(3, 1fr);
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

const Shop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #e5e7eb;
  width: 20vw;
  height: 25vh;
  padding: 10px;
  border-radius: 10px;
  a {
    margin-top: 10px;
    font-size: 16px;
    text-decoration: none;
    color: inherit;
    :visited {
      text-decoration: none;
      color: inherit;
    }
  }
`;

const Img = styled.img`
  width: 100%;
  height: 80%;
`;

const EmptyPhoto = styled.div`
  border: 0.5px dotted black;
  width: 100%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
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
    <InfoLayout>
      <PageTitle title="My list" />
      <ListBox>
        {list?.seeMyShopList?.length > 0 ? (
          <Shops>
            {list.seeMyShopList.map((item) => (
              <Shop key={item.id}>
                {item.photos.length > 0 ? (
                  <Img src={item.photos[0].url} />
                ) : (
                  <EmptyPhoto>
                    <span key={item.id}>Add a Photo!</span>
                  </EmptyPhoto>
                )}

                <Link to={`/${item.id}`}>{item.name}</Link>
              </Shop>
            ))}
          </Shops>
        ) : (
          <span>Add a Shop!</span>
        )}
      </ListBox>
    </InfoLayout>
  );
}
export default Home;
