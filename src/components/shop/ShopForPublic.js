import { faHeart, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SmallUserInfo from '../auth/SmallUserInfo';

const ShopBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 25px 0px;
  width: 900px;
  @media (max-width: 800px) {
    width: 80%;
    flex-direction: column;
  }
`;

const Name = styled.span`
  font-size: 28px;
  font-weight: 400;

  @media (max-width: 800px) {
    margin: 15px 0px;
  }
`;

const Address = styled.span`
  font-size: 18px;
  font-weight: 400;
  @media (max-width: 800px) {
    margin-top: -5px;
    margin-bottom: 15px;
  }
`;

const ImageBox = styled.div`
  width: 500px;
  height: 300px;
  @media (max-width: 1500px) {
    width: 100%;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 15px;
`;

const Texts = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 400px;
  margin-left: 80px;
  @media (max-width: 800px) {
    margin-left: 5px;
  }
`;

const Icons = styled.div`
  svg {
    margin-right: 5px;
    color: orange;
  }
  span {
    color: rgb(194, 141, 75);
    margin-right: 5px;
  }
`;

const Description = styled.span`
  font-size: 20px;
  font-weight: 400;
  margin: 15px 0px;
`;

const HashTagBox = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: 800px) {
    flex-direction: row;
  }
`;

const HashTag = styled.div`
  width: max-content;
  border: 1px solid rgb(194, 141, 75);
  border-radius: 5px;
  padding: 6.4px 8px;
  margin: 5px 0px;
  color: rgb(194, 141, 75);
  font-size: 15px;
`;

function ShopForPublic(item) {
  return (
    <ShopBox>
      {item?.photos?.length > 0 ? (
        <Link to={`/${item.id}`}>
          <ImageBox>
            <Image src={item.photos[0].url} />
          </ImageBox>
        </Link>
      ) : null}
      <Texts>
        <Link to={`/${item.id}`}>
          <Name>{item.name}</Name>
        </Link>
        <Address>{item.address}</Address>
        <Icons>
          <FontAwesomeIcon icon={faPen} size="1x" />
          <span>{item.replys.length}</span>
          <FontAwesomeIcon icon={faHeart} size="1x" />
          <span>{item.likes.length}</span>
        </Icons>
        <Description>{item.description}</Description>
        <HashTagBox>
          {item.categories?.length > 0
            ? item.categories.map((item) => (
                <HashTag key={item.name}>{item.name}</HashTag>
              ))
            : null}
        </HashTagBox>
      </Texts>
      <SmallUserInfo url={item?.user?.avatar} username={item?.user?.username} />
    </ShopBox>
  );
}
export default ShopForPublic;
