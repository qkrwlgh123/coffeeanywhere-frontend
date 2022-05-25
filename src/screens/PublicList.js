import React from 'react';
import styled from 'styled-components';
import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';
import ShopForPublic from '../components/shop/ShopForPublic';
import { Link } from 'react-router-dom';
import PublicListLayout from '../components/shop/PublicListLayout';
import PageTitle from '../components/PageTitle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faCalendarMinus } from '@fortawesome/free-regular-svg-icons';

const MainImgBox = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding-right: 230px;
  @media (max-width: 800px) {
    padding-right: 0px;
    margin-left: 50px;
    flex-direction: column;
    align-items: center;
  }
`;

const SearchBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 90px;
  margin-top: -35px;
  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 240px;
  font-size: 24px;
  font-weight: 400;
  border-bottom: 2px solid
    ${(props) => (props.changeColor ? props.theme.green : '#9ca3af')};
  margin-left: 16px;
  padding: 8px 12px;
`;

const SearchBoxBtn = styled.span`
  white-space: nowrap;
  color: ${(props) => (props.sortByPopular ? props.theme.green : '#1f2937')};
  cursor: pointer;
  font-size: 24px;
  font-weight: 400;
  margin-left: 16px;
  span {
    margin-left: 5px;
  }
`;

const SortBtnBox = styled.div`
  @media (max-width: 800px) {
    margin-top: 15px;
  }
`;

const TextsBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 120px;
  margin-top: 65px;
  margin-left: 20px;
`;

const Title = styled.div`
  white-space: nowrap;
  font-family: 'Gugi';
  font-size: 60px;
  font-weight: 700;
`;

const Subtitle = styled.div`
  white-space: nowrap;
  font-size: 24px;
  font-weight: 400;
  margin-top: 32px;
`;

const AnimationImgBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 520px;
`;

const Layout = styled.div`
  display: flex;
  flex-direction: column;

  a {
    color: #212529;
    :visited {
      color: #212529;
    }
  }
`;

const FetchMoreBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 550px;
  text-align: center;
  padding: 10px 0px;
  border: 0.3px solid rgb(233, 236, 239);
  span {
    cursor: pointer;
    font-size: 16px;
    color: #868e96;
  }
`;

const LIST_QUERY = gql`
  query seeCoffeeShops($offset: Int) {
    seeCoffeeShops(offset: $offset) {
      id
      name
      user {
        id
        username
        avatar
      }
      description
      address
      categories {
        name
      }
      photos {
        url
      }
      replys {
        content
      }
      likes {
        like
      }
    }
  }
`;

function PublicList() {
  const [inputFocus, setInputFocus] = useState('');
  const [sortByPopular, setSortByPopular] = useState(true);
  const [list, setList] = useState([]);
  const { loading, data, fetchMore } = useQuery(LIST_QUERY, {
    variables: {
      offset: 0,
    },
    onCompleted: () => setList(data.seeCoffeeShops),
  });

  const onFetchMore = () => {
    fetchMore({
      variables: {
        offset: data?.seeCoffeeShops.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }
        if (fetchMoreResult.seeCoffeeShops.length === 0) {
          alert('마지막 목록입니다');
          return;
        }
        return Object.assign({}, prev, {
          seeCoffeeShops: [
            ...prev.seeCoffeeShops,
            ...fetchMoreResult.seeCoffeeShops,
          ],
        });
      },
    });
  };

  return (
    <PublicListLayout>
      <PageTitle title="EveryOne's Coffee" />
      <MainImgBox>
        <TextsBox>
          <Title>모두의 Coffee</Title>
          <Subtitle>전국에 있는 사용자들과 카페 정보를 공유해보세요.</Subtitle>
        </TextsBox>
        <AnimationImgBox>둥둥 그림</AnimationImgBox>
      </MainImgBox>
      <SearchBar>
        <SearchBox>
          <FontAwesomeIcon icon={faMagnifyingGlass} size="5x" color="#2ECC71" />
          <SearchInput
            type="text"
            changeColor={inputFocus}
            onFocus={() => setInputFocus(true)}
            onBlur={() => setInputFocus(false)}
          />
          <SearchBoxBtn>검색</SearchBoxBtn>
          <SearchBoxBtn>초기화</SearchBoxBtn>
        </SearchBox>
        <SortBtnBox>
          <SearchBoxBtn
            sortByPopular={sortByPopular}
            onClick={() => setSortByPopular(true)}
          >
            <FontAwesomeIcon icon={faFire} />
            <span>인기</span>
          </SearchBoxBtn>

          <SearchBoxBtn
            sortByPopular={!sortByPopular}
            onClick={() => setSortByPopular(false)}
          >
            <FontAwesomeIcon icon={faCalendarMinus} />
            <span>최신</span>
          </SearchBoxBtn>
        </SortBtnBox>
      </SearchBar>
      <Layout>
        {list?.map((item, index) => (
          <ShopForPublic key={index} {...item} />
        ))}
        {loading ? null : (
          <FetchMoreBtn>
            <span onClick={onFetchMore}>더보기</span>
          </FetchMoreBtn>
        )}
      </Layout>
    </PublicListLayout>
  );
}
export default PublicList;
