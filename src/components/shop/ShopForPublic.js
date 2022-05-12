import React from 'react';
import styled from 'styled-components';

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

const Name = styled.span`
  font-size: 28px;
  font-weight: 400;

  @media (max-width: 800px) {
    margin: 15px 0px;
  }
`;

const Description = styled.span`
  font-size: 20px;
  font-weight: 400;
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
        <ImageBox>
          <Image src={item.photos[0].url} />
        </ImageBox>
      ) : null}
      <Texts>
        <Name>{item.name}</Name>
        <Description>{item.description}</Description>
        <HashTagBox>
          {item.categories?.length > 0
            ? item.categories.map((item) => (
                <HashTag key={item.name}>{item.name}</HashTag>
              ))
            : null}
        </HashTagBox>
      </Texts>
      <div>
        <span>{item.user?.username}</span>
      </div>
    </ShopBox>
  );
}
export default ShopForPublic;
