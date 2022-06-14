import { useNavigate, useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';
import PageTitle from '../components/PageTitle';
import { useState } from 'react';

import { faUser } from '@fortawesome/free-regular-svg-icons'; // ♡
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TOKEN } from '../apollo';
import ProfileInfoLayout from '../components/shop/ProfileInfoLayout';
import ShopForPublic from '../components/shop/ShopForPublic';
import { Layout } from './PublicList';
import PublicListLayout from '../components/shop/PublicListLayout';
import { ListBox } from './MyLikeList';

const Shop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  cursor: pointer;
`;

const ImgBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 210px;
  margin-bottom: 15px;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: fill;
  border-radius: 5%;
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

const PROFILE_QUERY = gql`
  query seeMyShopList {
    seeMyShopList {
      id
      name
      photos {
        id
        url
      }
    }
  }
`;

function MyShops() {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);

  const { data } = useQuery(PROFILE_QUERY, {
    context: {
      headers: {
        token: localStorage.getItem(TOKEN),
      },
    },
    fetchPolicy: 'no-cache',
  });

  return (
    <PublicListLayout>
      <PageTitle title={`내 목록`} />
      {data?.seeMyShopList?.length > 0 ? (
        <Layout>
          {data?.seeMyShopList?.map((item) => (
            <Shop
              onMouseOver={() => setActive(item?.id)}
              onMouseOut={() => setActive(0)}
              key={item?.id}
              onClick={() => navigate(`/${item?.id}`)}
            >
              {item?.photos?.length > 0 ? (
                <ImgBox>
                  <Img src={item?.photos[0].url} />
                </ImgBox>
              ) : (
                <EmptyPhoto>
                  <span key={item?.id}>사진을 추가해주세요</span>
                </EmptyPhoto>
              )}
              <NameBox active={active === item?.id}>
                <span>{item?.name}</span>
              </NameBox>
            </Shop>
          ))}
        </Layout>
      ) : (
        <ListBox>
          <span>새 게시물을 작성해보세요!</span>
        </ListBox>
      )}
    </PublicListLayout>
  );
}
export default MyShops;
