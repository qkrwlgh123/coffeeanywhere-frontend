import { TOKEN } from '../apollo';
import { useNavigate } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';
import PageTitle from '../components/PageTitle';
import { useState } from 'react';
import InfoLayout from '../components/shop/InfoLayout';

const ListBox = styled.div`
  display: flex;
  justify-content: center;
  width: 90%;
  margin-top: 10%;
  padding: 30px 15px;
`;

const Shops = styled.div`
  display: grid;
  /* Media Query for Laptops and Desktops */
  @media (min-width: 1280px) {
    grid-template-columns: repeat(3, 1fr);
    column-gap: 2.5rem;
    row-gap: 4.5rem;
  }
  /* Media Query for Tablet */
  @media (min-width: 768px) and (max-width: 1279px) {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 30px;
  }
  /* Media Query for Mobile */
  @media (max-width: 650px) {
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 30px;
  }
`;

const Shop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 378px;
  height: 213px;
  cursor: pointer;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 8px;
`;

const EmptyPhoto = styled.div`
  width: 100%;
  height: 100%;
  border: 0.5px dotted black;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NameBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  width: 90%;
  padding: 20px 8px;
  position: relative;
  border-radius: 8px;
  border-color: rgb(229, 231, 235);
  box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px;
  transition: all 0.2s ease-in-out;
  top: ${(props) => (props.active ? '-45px' : '-30px')};
  span {
    font-size: 20px;
    font-weight: 400;
    color: inherit;
  }
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
  const [active, setActive] = useState(false);
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
              <Shop
                onMouseOver={() => setActive(item.id)}
                onMouseOut={() => setActive(0)}
                key={item.id}
                onClick={() => navigate(`/${item.id}`)}
              >
                {item.photos.length > 0 ? (
                  <Img src={item.photos[0].url} />
                ) : (
                  <EmptyPhoto>
                    <span key={item.id}>사진을 추가해주세요</span>
                  </EmptyPhoto>
                )}
                <NameBox active={active === item.id}>
                  <span>{item.name}</span>
                </NameBox>
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
