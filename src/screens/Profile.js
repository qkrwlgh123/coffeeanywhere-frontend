import { useNavigate, useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';
import PageTitle from '../components/PageTitle';
import { useState } from 'react';
import { faUser } from '@fortawesome/free-regular-svg-icons'; // ♡
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TOKEN } from '../apollo';
import Avatar from '../components/auth/Avatar';
import ProfileInfoLayout from '../components/shop/ProfileInfoLayout';

const Title = styled.span`
  font-size: 36px;
`;

const UserInfoBox = styled.div`
  margin: 50px 0px;
  width: 100%;
  display: flex;
  align-items: center;
  div:first-child {
    img {
      width: 126px;
      height: 128px;
      border-radius: 9999px;
    }
    div {
      width: 126px;
      height: 128px;
      border-radius: 9999px;
    }
  }
`;

const UserTextsBox = styled.div`
  margin-left: 48px;
`;

const UserName = styled.span`
  font-size: 24px;
  color: #1f2937;
`;

const UserInfos = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  span {
    font-size: 18px;
    color: #1f2937;
  }
  span:last-child {
    margin-left: 16px;
  }
`;

const UserDescribe = styled.div`
  margin-top: 20px;
  font-size: 18px;
  color: #1f2937;
`;

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
  query seeUser($username: String) {
    seeUser(username: $username) {
      ok
      error
      user {
        username
        avatar
        description
        likes {
          id
        }
      }
      shop {
        id
        name
        photos {
          id
          url
        }
      }
      followers {
        username
      }
      following {
        username
      }
      totalFollowers
      totalFollowing
    }
  }
`;

function Profile() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [active, setActive] = useState(false);

  const { data } = useQuery(PROFILE_QUERY, {
    variables: {
      username: name,
    },
    fetchPolicy: 'no-cache',
  });

  return (
    <ProfileInfoLayout>
      <PageTitle title={`${name}님의 관심 목록`} />
      <Title>프로필</Title>
      <UserInfoBox>
        <Avatar url={data?.seeUser.user.avatar} />
        <UserTextsBox>
          <UserName>{data?.seeUser.user.username}</UserName>
          <UserInfos>
            <span>게시물 {data?.seeUser.shop.length}개</span>
            <span>좋아요 {data?.seeUser.user.likes?.length}개</span>
          </UserInfos>
          <UserDescribe>
            {data?.seeUser.user.description
              ? data?.seeUser.user.description
              : '간단하게 자신을 소개해주세요!'}
          </UserDescribe>
        </UserTextsBox>
      </UserInfoBox>
      <ListBox>
        {data?.seeUser.shop?.length > 0 ? (
          <Shops>
            {data?.seeUser.shop?.map((item) => (
              <Shop
                onMouseOver={() => setActive(item?.id)}
                onMouseOut={() => setActive(0)}
                key={item?.id}
                onClick={() => navigate(`/${item?.id}`)}
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
    </ProfileInfoLayout>
  );
}
export default Profile;
