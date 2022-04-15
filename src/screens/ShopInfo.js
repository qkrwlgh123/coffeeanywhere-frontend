import { gql, useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { TOKEN } from '../apollo';
import Button from '../components/auth/Button';
import Notification from '../components/auth/Notification';
import PageTitle from '../components/PageTitle';
import { BaseBox, Title } from '../components/shared';
import HomeLayout from '../components/shop/HomeLayout';
import routes from '../routes';
import { HomeBox, LogOut } from './Home';

const { kakao } = window;

const InfoBox = styled(HomeBox)`
  width: 1500px;
`;

export const EditBtn = styled.div`
  margin-top: 15px;
  border: 1px solid ${(props) => props.theme.accent};
  background-color: ${(props) => props.theme.accent};
  color: white;
  font-size: 12px;
  font-weight: 600;
  width: 80px;
  height: 25px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${(props) => (props.disabled ? 0 : 1)};
  cursor: ${(props) => (props.disabled ? 'progress' : 'pointer')};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
`;

const Addr = styled.span`
  font-weight: 500;
  font-size: 15px;
  margin-top: 20px;
`;

const HashtagBox = styled.span`
  margin-top: 20px;
  span {
    margin-right: 5px;
  }
`;

const PhotoBox = styled.div`
  display: flex;
  justify-content: center;
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
    <HomeLayout>
      <PageTitle title={`${list?.name}`} />
      <Notification message={message} />
      {message === '' ? (
        <InfoBox>
          <Title>{list?.name}</Title>
          <Notification message={message} />
          <PhotoBox>
            {photos.length > 0 ? (
              photos.map((item) => <img key={item.url} src={item.url} />)
            ) : (
              <span>Add a photos!</span>
            )}
          </PhotoBox>
          <Addr>{space ? space : null}</Addr>
          <HashtagBox>
            {categories.length !== 0 ? (
              categories.map((item) => <span key={item.name}>{item.name}</span>)
            ) : (
              <span>no hash tags</span>
            )}
          </HashtagBox>
          <div>
            <Link to={`/shop/${id}`} reloadDocument>
              <EditBtn disabled={message !== ''}>Edit</EditBtn>
            </Link>
            <EditBtn onClick={handleDeleteShop} disabled={message !== ''}>
              Delete
            </EditBtn>
          </div>
        </InfoBox>
      ) : null}
    </HomeLayout>
  );
}
export default ShopInfo;
