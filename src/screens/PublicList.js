import React from 'react';
import styled from 'styled-components';
import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';
import ShopForPublic from '../components/shop/ShopForPublic';
import { Link } from 'react-router-dom';
import PublicListLayout from '../components/shop/PublicListLayout';

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
