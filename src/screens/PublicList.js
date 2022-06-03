import React from 'react';
import styled from 'styled-components';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { useState } from 'react';
import ShopForPublic from '../components/shop/ShopForPublic';
import { Link } from 'react-router-dom';
import PublicListLayout from '../components/shop/PublicListLayout';
import PageTitle from '../components/PageTitle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faFire,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { faCalendarMinus } from '@fortawesome/free-regular-svg-icons';
import { useEffect } from 'react';

const MainImgBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
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
  align-items: center;
  position: relative;
  left: 8%;
  margin-top: -35px;
  @media (max-width: 800px) {
    flex-direction: column;
    left: 0;
  }
`;

const SearchBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const SearchInputBox = styled.div`
  display: flex;
  align-items: center;
`;

export const SearchInput = styled.input`
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

const SearchMessageBox = styled.div`
  padding-top: 32px;
  position: relative;
  left: 8%;
  @media (max-width: 800px) {
    flex-direction: column;
    left: 0;
  }
`;

const SearchMessage = styled.span`
  color: #4b5563;
  font-size: 18px;
  font-weight: 500;
  white-space: nowrap;
  margin-left: 8px;
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
  display: grid;
  margin: 48px;

  /* Media Query for Laptops and Desktops */
  @media (min-width: 1501px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1.5rem;
    padding: 0px 130px;
  }
  /* Media Query for Tablet */
  @media (min-width: 900px) and (max-width: 1500px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
  @media (min-width: 551px) and (max-width: 899px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  /* Media Query for Mobile */
  @media (max-width: 550px) {
    grid-template-columns: repeat(1, 1fr);
    gap: 1.5rem;
  }

  a {
    color: #212529;
    :visited {
      color: #212529;
    }
  }
`;

const LIST_QUERY = gql`
  query seeCoffeeShops($page: Int, $keyword: String) {
    seeCoffeeShops(page: $page, keyword: $keyword) {
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
  const [inputValue, setInputValue] = useState('');
  const [keyword, setKeyword] = useState('');
  const { loading, data, fetchMore, refetch } = useQuery(LIST_QUERY, {
    variables: {
      page: 0,
      keyword,
    },
  });

  const handleInputValue = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmitValue = () => {
    setKeyword(inputValue);
  };

  const handleClearInput = () => {
    setKeyword('');
  };

  const onFetchMore = () => {
    fetchMore({
      variables: {
        page: data?.seeCoffeeShops.length,
        keyword,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }
        // if (fetchMoreResult.seeCoffeeShops.length === 0) {
        //   return;
        // }
        return Object.assign({}, prev, {
          seeCoffeeShops: [
            ...prev.seeCoffeeShops,
            ...fetchMoreResult.seeCoffeeShops,
          ],
        });
      },
    });
  };

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      onFetchMore();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

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
          <SearchInputBox>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              size="5x"
              color="#2ECC71"
            />
            <SearchInput
              type="text"
              changeColor={inputFocus}
              value={inputValue}
              onChange={handleInputValue}
              onFocus={() => setInputFocus(true)}
              onBlur={() => setInputFocus(false)}
            />
            <SearchBoxBtn onClick={handleSubmitValue}>검색</SearchBoxBtn>
            <SearchBoxBtn onClick={handleClearInput}>초기화</SearchBoxBtn>
          </SearchInputBox>
        </SearchBox>
      </SearchBar>
      <SearchMessageBox>
        <FontAwesomeIcon icon={faCheck} size="2x" color="#2ECC71" />
        <SearchMessage>상호명과 태그를 기반으로 검색합니다.</SearchMessage>
      </SearchMessageBox>
      <Layout>
        {data?.seeCoffeeShops?.map((item) => (
          <ShopForPublic key={item.id} {...item} />
        ))}
      </Layout>
    </PublicListLayout>
  );
}
export default PublicList;
