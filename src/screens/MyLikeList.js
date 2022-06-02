import { useNavigate, useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';
import PageTitle from '../components/PageTitle';
import { useState } from 'react';

import { faUser } from '@fortawesome/free-regular-svg-icons'; // ♡
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TOKEN } from '../apollo';
import ProfileInfoLayout from '../components/shop/ProfileInfoLayout';

const ListBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
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

const UserInfoBox = styled.div`
  margin-top: 150px;
  width: 35%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UserImg = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 70px;
`;

const UserNoneImg = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;
`;

const UserName = styled.div`
  display: flex;
  margin-top: 10px;
  justify-content: center;
  align-items: center;
  background-color: rgb(255, 255, 255);
  border: 0px solid rgb(229, 231, 235);
  border-radius: 9999px;
  width: 80%;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px;
  padding: 30px 40px;
  font-size: 30px;
  font-weight: 500;
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
          photos {
            id
            url
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
  console.log(data);
  return (
    <ProfileInfoLayout>
      <PageTitle title={`${name}님의 관심 목록`} />
      <ListBox>
        {data?.seeMyProfile.likes?.length > 0 ? (
          <Shops>
            {data?.seeMyProfile.likes?.map((item) => (
              <Shop
                onMouseOver={() => setActive(item?.coffeeShop.id)}
                onMouseOut={() => setActive(0)}
                key={item?.coffeeShop.id}
                onClick={() => navigate(`/${item?.coffeeShop.id}`)}
              >
                {item?.coffeeShop.photos?.length > 0 ? (
                  <Img src={item?.coffeeShop?.photos[0].url} />
                ) : (
                  <EmptyPhoto>
                    <span key={item?.coffeeShop.id}>사진을 추가해주세요</span>
                  </EmptyPhoto>
                )}
                <NameBox active={active === item?.coffeeShop.id}>
                  <span>{item?.coffeeShop.name}</span>
                </NameBox>
              </Shop>
            ))}
          </Shops>
        ) : (
          <span>Add a Shop!</span>
        )}
      </ListBox>
    </ProfileInfoLayout>
  );
}
export default LikeList;
