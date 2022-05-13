import React from 'react';
import styled from 'styled-components';
import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';
import ShopForPublic from '../components/shop/ShopForPublic';
import { Link, useNavigate } from 'react-router-dom';

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
        username
      }
      description
      categories {
        name
      }
      photos {
        url
      }
      replys {
        content
      }
    }
  }
`;

function PublicList() {
  const navigate = useNavigate();
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
    <Layout>
      {list?.map((item, index) => (
        <Link to={`/${item.id}`}>
          <ShopForPublic key={index} {...item} />
        </Link>
      ))}
      {loading ? null : (
        <FetchMoreBtn>
          <span onClick={onFetchMore}>더보기</span>
        </FetchMoreBtn>
      )}
    </Layout>
  );
}
export default PublicList;
