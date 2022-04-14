import AuthLayout from '../components/auth/AuthLayout';
import FormBox from '../components/auth/FormBox';
import Input from '../components/auth/input';
import PageTitle from '../components/PageTitle';
import { Title } from '../components/shared';
import styled from 'styled-components';
import { useState } from 'react';
import { useEffect } from 'react';
import Button from '../components/auth/Button';
import { useForm } from 'react-hook-form';
import FormError from '../components/auth/FormError';
import { gql, useMutation } from '@apollo/client';
import { TOKEN } from '../apollo';
import { useNavigate } from 'react-router-dom';
import routes from '../routes';
import Notification from '../components/auth/Notification';

const { kakao } = window;

const CreateTitle = styled(Title)`
  margin-bottom: 15px;
`;

const Message = styled.span`
  margin-top: 5px;
  font-weight: 600;
`;
export const DescribeInput = styled(Input)`
  height: 70px;
`;

export const ListBox = styled.div`
  width: 100%;
`;

export const ShopList = styled.ul``;

export const ShopName = styled.li`
  font-size: 15px;
  cursor: pointer;
  margin: 5px 0px;
`;

const Address = styled.span`
  font-size: 10px;
  cursor: not-allowed;
  pointer-events: none;
`;

const CREATE_SHOP_MUTATION = gql`
  mutation createShop(
    $name: String!
    $caption: String
    $longitude: String
    $latitude: String
    $file: Upload
  ) {
    createShop(
      name: $name
      caption: $caption
      longitude: $longitude
      latitude: $latitude
      file: $file
    ) {
      ok
      error
    }
  }
`;

function CreateShop() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [place, setPlace] = useState('');

  const onPlace = (event) => {
    setPlace(event.target.value);
    if (event.target.value == '') {
      setPlace(null);
      clearList();
    }
  };

  const clearPlace = (event) => {
    setPlace(null);
  };
  const [placeList, setPlaceList] = useState([]);
  let name, latitude, longitude;
  const [sendData, setSendData] = useState({});

  // place를 이용한 장소 검색
  const searchPlace = (place) => {
    if (place !== '' && place !== null) {
      // 장소 검색 객체
      let ps = new kakao.maps.services.Places();
      let searchOption = {
        category_group_code: 'CE7',
        size: 5,
      };
      ps.keywordSearch(place, placesSearchCB, searchOption);
      function placesSearchCB(data, status, pagination) {
        if (status === kakao.maps.services.Status.OK) {
          setPlaceList(data);
        }
      }
      placesSearchCB(place, placesSearchCB);
    }
  };

  useEffect(() => {
    searchPlace(place);
  }, [place]);

  const clearList = () => {
    setPlaceList([]);
  };

  const saveCoordinates = (event) => {
    name = event.target.getAttribute('name');
    longitude = event.target.getAttribute('x');
    latitude = event.target.getAttribute('y');
    setPlace(name);
    setSendData({ longitude, latitude });
    clearList();
  };

  const onCompleted = (data) => {
    const {
      createShop: { ok },
    } = data;
    if (ok) {
      setMessage(
        'Shop is successfully added! After a while, you will go to home.'
      );

      setTimeout(() => navigate(routes.home), 1000);
    }
  };

  const [createShop, { loading }] = useMutation(CREATE_SHOP_MUTATION, {
    onCompleted,
    context: {
      headers: {
        token: localStorage.getItem(TOKEN),
      },
    },
  });

  const onSubmitValid = (data) => {
    if (loading) {
      return;
    }
    const { name, caption, file } = data;
    const { latitude, longitude } = sendData;
    console.log(name, caption, file, latitude, longitude);
    createShop({
      variables: {
        name,
        caption,
        longitude,
        latitude,
        file: file[0],
      },
    });
  };

  const { register, handleSubmit, errors, formState } = useForm({
    mode: 'onChange',
  });

  return (
    <AuthLayout>
      <PageTitle title="Add a shop" />
      <FormBox>
        <CreateTitle>Add a Shop</CreateTitle>
        <Notification message={message} />
        {message === '' ? (
          <form onSubmit={handleSubmit(onSubmitValid)}>
            <Input
              ref={register({
                required: 'Shop is required.',
              })}
              value={place}
              name="name"
              onChange={onPlace}
              onClick={clearPlace}
              type="text"
              placeholder="Search a shop"
            />
            {placeList.length > 0 ? (
              <ListBox>
                <ShopList>
                  {placeList.map((item) => (
                    <ShopName
                      onClick={saveCoordinates}
                      x={item.x}
                      y={item.y}
                      name={item.place_name}
                      key={item.id}
                    >
                      {item.place_name} - <Address>{item.address_name}</Address>
                    </ShopName>
                  ))}
                </ShopList>
              </ListBox>
            ) : null}
            <FormError message={errors?.caption?.message} />
            <DescribeInput
              ref={register({
                required: 'Describtion is required.',
                minLength: {
                  value: 2,
                  message: 'Describtion should be longer than 2 chars.',
                },
              })}
              name="caption"
              type="text"
              placeholder="Describe about a shop with Hash tag(#)"
            />
            <Input
              ref={register}
              name="file"
              type="file"
              accept="image/*"
              placeholder="Image"
            />
            {message === '' ? (
              <Button
                type="submit"
                value={loading ? 'Loading...' : 'Add a coffee shop'}
                disabled={!formState.isValid || loading || message !== ''}
              />
            ) : null}
          </form>
        ) : null}
      </FormBox>
    </AuthLayout>
  );
}
export default CreateShop;
