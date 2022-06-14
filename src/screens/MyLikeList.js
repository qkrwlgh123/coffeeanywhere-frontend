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

export const ListBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
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

const PROFILE_QUERY = gql`
  query seeMyProfile($username: String) {
    seeMyProfile(username: $username) {
      ok
      error
      user {
        username
        avatar
      }
      likes {
        coffeeShop {
          id
          name
          address
          user {
            username
            avatar
          }
          photos {
            id
            url
          }
          likes {
            like
          }
          replys {
            content
          }
        }
      }
    }
  }
`;

function LikeList() {
  const { name } = useParams();
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
      <PageTitle title={`관심 목록`} />
      {data?.seeMyProfile.likes?.length > 0 ? (
        <Layout>
          {data?.seeMyProfile.likes?.map((item) => (
            <ShopForPublic key={item.coffeeShop.id} {...item.coffeeShop} />
          ))}
        </Layout>
      ) : (
        <ListBox>
          <span>관심 목록에 게시물을 추가해보세요!</span>
        </ListBox>
      )}
    </PublicListLayout>
  );
}
export default LikeList;
