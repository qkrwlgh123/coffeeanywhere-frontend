import { gql, useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { TOKEN } from '../apollo';
import Notification from '../components/auth/Notification';
import PageTitle from '../components/PageTitle';
import InfoLayout from '../components/shop/InfoLayout';
import routes from '../routes';

const { kakao } = window;

const InfoBox = styled.div`
  margin-top: 5%;
  width: 80%;
  padding: 15px;
  background-color: #ffffff;
  justify-content: none;
`;

const TitleBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Name = styled.span`
  width: 33%;
  font-size: 1.5rem;
  font-weight: 700;
`;

const Addr = styled.span`
  display: flex;
  justify-content: center;
  font-weight: 500;
  font-size: 16px;
  width: 33%;
`;

const Buttons = styled.div`
  display: flex;
  width: 33%;
  justify-content: flex-end;
  align-items: center;
  font-size: 16px;
  a {
    color: inherit;
    text-decoration: none;
    margin-right: 10px;
    :visited {
      color: inherit;
      text-decoration: none;
    }
  }
  span {
    cursor: pointer;
  }
`;

const HashtagBox = styled.div`
  margin-top: 35px;
  margin-left: 20px;
  display: flex;
  div {
    border-radius: 5px;
    padding: 10px;
    font-weight: 600;
    font-size: 16px;
    margin-right: 10px;
    background-color: #e5e7eb;
  }
`;

const PhotoList = styled.div`
  margin-top: 35px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 5px;
`;

const PhotoBox = styled.div`
  background-color: #e5e7eb;
  width: 90%;
  height: 30vh;
  padding: 12px;
  border-radius: 10px;
`;

const Photoimg = styled.img`
  width: 100%;
  height: 100%;
`;

const SHOP_QUERY = gql`
  query seeCoffeeShop($id: Int!) {
    seeCoffeeShop(id: $id) {
      ok
      error
      shop {
        name
        longitude
        latitude
        photos {
          url
        }
        categories {
          name
        }
      }
    }
  }
`;

const DELETE_SHOP = gql`
  mutation deleteShop($id: Int!) {
    deleteShop(id: $id) {
      ok
      error
    }
  }
`;

function ShopInfo() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [list, setList] = useState([]);
  const [address, setAddress] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const { id } = useParams();
  const { data } = useQuery(SHOP_QUERY, {
    variables: {
      id: Number(id),
    },
    context: {
      headers: {
        token: localStorage.getItem(TOKEN),
      },
    },
    onCompleted: () => {
      if (data) {
        setList(data.seeCoffeeShop.shop);
        setPhotos(data.seeCoffeeShop.shop.photos);
        setCategories(data.seeCoffeeShop.shop.categories);
        searchDetailAddrFromCoords(data.seeCoffeeShop.shop, Info);
      }
    },
  });

  const [deleteShop, { loading }] = useMutation(DELETE_SHOP, {
    onCompleted: () => {
      setMessage('Successfully deleted. After a while, you will back to list.');
      setTimeout(() => navigate(routes.home, { replace: true }), 1000);
    },
  });

  const handleDeleteShop = () => {
    if (loading) {
      return;
    }
    deleteShop({
      variables: {
        id: Number(id),
      },
    });
  };
  // 주소-좌표 변환 객체를 생성합니다
  const geocoder = new kakao.maps.services.Geocoder();

  function searchDetailAddrFromCoords(coords, callback) {
    // 좌표로 법정동 상세 주소 정보를 요청합니다
    geocoder.coord2Address(coords.longitude, coords.latitude, callback);
  }
  //  좌표에 대한 주소정보를 표출하는 함수입니다
  function Info(result, status) {
    if (status === kakao.maps.services.Status.OK) {
      setAddress(result);
    }
  }
  const space = address[0]?.address.address_name;

  return (
    <InfoLayout>
      <PageTitle title={`${list?.name}`} />
      <Notification message={message} />
      {message === '' ? (
        <InfoBox>
          <TitleBox>
            <Name>{list?.name}</Name>
            <Addr>{space ? space : null}</Addr>
            <Buttons>
              <Link to={`/shop/${id}`} reloadDocument>
                <span disabled={message !== ''}>Edit</span>
              </Link>
              <span onClick={handleDeleteShop} disabled={message !== ''}>
                Delete
              </span>
            </Buttons>
          </TitleBox>
          <HashtagBox>
            {categories.length !== 0 ? (
              categories.map((item) => <div key={item.name}>{item.name}</div>)
            ) : (
              <span>no hash tags</span>
            )}
          </HashtagBox>
          <PhotoList>
            {photos.length > 0 ? (
              photos.map((item) => (
                <PhotoBox>
                  <Photoimg key={item.url} src={item.url} />
                </PhotoBox>
              ))
            ) : (
              <span>Add a photos!</span>
            )}
          </PhotoList>
        </InfoBox>
      ) : null}
    </InfoLayout>
  );
}
export default ShopInfo;
