import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faComments, faHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SmallUserInfo from '../auth/SmallUserInfo';

const ShopBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  padding: 16px;
  border: 2px solid #667080;
`;

const Name = styled.span`
  font-size: 20px;
  font-weight: 400;
  color: #1f2937;
`;

const Address = styled.span`
  font-size: 15px;
  font-weight: 400;
  color: #1f2937;
  margin-top: 8px;
`;

const ImageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 250px;
  margin-bottom: 15px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: fill;
`;

const Texts = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  padding: 0px 5px;
  @media (max-width: 800px) {
    margin-left: 5px;
  }
`;

const Icons = styled.div`
  display: flex;
  align-items: center;
  svg {
    width: 24px;
    height: 24px;
  }
  span {
    margin: 0px 4px;
    font-size: 16px;
    color: #1f2937;
  }
`;

const HashTagBox = styled.div`
  display: flex;
  margin-top: 8px;
`;

const HashTag = styled.div`
  margin-left: 4px;
  color: #1f2937;
  font-size: 14px;
`;

const OwnerInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
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
        <HashTagBox>
          {item.categories?.length > 0
            ? item.categories.map((item) => (
                <HashTag key={item.name}>{item.name}</HashTag>
              ))
            : null}
        </HashTagBox>
        <OwnerInfo>
          <SmallUserInfo
            url={item?.user?.avatar}
            username={item?.user?.username}
          />
          <Icons>
            <FontAwesomeIcon icon={faHeart} size="1x" color="#D63031" />
            <span>{item.likes.length} </span>
            <FontAwesomeIcon icon={faComments} size="1x" color="#1f2937" />
            <span>{item.replys.length} </span>
          </Icons>
        </OwnerInfo>
      </Texts>
    </ShopBox>
  );
}
export default ShopForPublic;
