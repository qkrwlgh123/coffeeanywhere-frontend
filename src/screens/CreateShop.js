import PageTitle from '../components/PageTitle';
import styled from 'styled-components';
import Input from '../components/auth/input';
import { useState } from 'react';
import { useEffect } from 'react';
import Button from '../components/auth/Button';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { TOKEN } from '../apollo';
import { useNavigate } from 'react-router-dom';
import routes from '../routes';
import Notification from '../components/auth/Notification';
import CreateLayout from '../components/shop/CreateLayout';
import CreateShopBox from '../components/shop/CreateShopBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faX } from '@fortawesome/free-solid-svg-icons';
import { Message } from './ShopInfo';

const { kakao } = window;

const CreateTitle = styled.span`
  font-weight: 600;
  font-size: 48px;
  margin-bottom: 80px;
`;

const CreateInput = styled.input`
  width: 50%;
  border-radius: 10px;
  padding: 10px;
  background-color: #fafafa;
  border: 0.5px solid rgb(219, 219, 219);
  box-sizing: border-box;
  font-size: 18px;
  opacity: ${(props) => (props.disabled ? 0.4 : 1)};
  &::placeholder {
    font-size: 18px;
  }
  :focus {
    border: 3px solid rgb(219, 219, 219);
  }
`;
export const ListBox = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 15px;
  justify-content: center;
`;

export const ShopList = styled.ul``;

export const ShopName = styled.li`
  font-size: 18px;
  margin: 10px 0px;
`;

export const DescribeInput = styled.input`
  width: 90%;
  margin-top: 20px;
  border-radius: 10px;
  padding: 10px;
  background-color: #fafafa;
  border: 0.5px solid rgb(219, 219, 219);
  box-sizing: border-box;
  font-size: 18px;
  opacity: ${(props) => (props.disabled ? 0.4 : 1)};
  &::placeholder {
    font-size: 18px;
  }
  :focus {
    border: 3px solid rgb(219, 219, 219);
  }
`;

const Address = styled.span`
  font-size: 16px;
  cursor: not-allowed;
  pointer-events: none;
`;

const SelectBtn = styled.div`
  display: inline;
  margin-left: 5px;
  border: 1.5px solid rgb(219, 219, 219);
  padding: 2px;
  border-radius: 5px;
  font-size: 15px;
  cursor: pointer;
`;

const SelectedShop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 25px;
  border: 1px solid black;
  border-radius: 5px;
  width: 50%;
  padding: 10px;
  border: 0.5px solid rgba(219, 219, 219, 1);
`;

const InputHashtagsBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0px;
  span:last-child {
    margin-top: 20px;
    cursor: pointer;
    font-size: 15px;
    padding: 10px;
    border-radius: 5px;
    border: 0.5px solid rgba(219, 219, 219, 1);
  }
`;

const InputHashtags = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin: 2px 0px;
  position: relative;
  right: 10px;
  span {
    font-size: 18px;
    margin: 0px 5px;
  }
`;

export const UploadBox = styled.div`
  display: flex;
  width: 50%;
  label {
    color: rgb(38, 38, 38);
    border: 0.5px solid rgba(219, 219, 219, 1);
    cursor: pointer;
    margin-left: 5px;
    font-size: 15px;
    padding: 10px;
    width: 40%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
  }
`;

const UploadName = styled.input`
  width: 100%;
  border-radius: 5px;
  padding: 10px;
  background-color: #fafafa;
  border: 0.5px solid rgb(219, 219, 219);
  box-sizing: border-box;
  font-size: 18px;
  &::placeholder {
    font-size: 18px;
  }
`;

export const FileUpload = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  padding: 0;
  overflow: hidden;
  border: 0;
`;

const CREATE_SHOP_MUTATION = gql`
  mutation createShop(
    $name: String!
    $caption: String
    $longitude: String
    $latitude: String
    $description: String
    $file: Upload
  ) {
    createShop(
      name: $name
      caption: $caption
      longitude: $longitude
      latitude: $latitude
      description: $description
      file: $file
    ) {
      ok
      error
    }
  }
`;

function CreateShop() {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState('');
  const [hashTagNum, setHashTagNum] = useState(1);
  const [hashTagArr, setHashTagArr] = useState([hashTagNum]);
  const [maxhashTag, setMaxhashTag] = useState('');
  const handleHashtagNum = () => {
    if (hashTagNum < 5) {
      setHashTagNum((current) => current + 1);
      setHashTagArr([...hashTagArr, hashTagNum]);
    } else {
      setMaxhashTag('최대 5개까지 추가 가능합니다.');
    }
  };

  const [message, setMessage] = useState('');
  const [place, setPlace] = useState('');
  const [shopName, setShopName] = useState('');

  const onPlace = (event) => {
    setPlace(event.target.value);
    if (event.target.value === '') {
      clearPlace();
    }
  };

  const clearPlace = () => {
    setPlace('');
    clearList();
    setSendData({});
  };

  const [placeList, setPlaceList] = useState([]);
  let name, latitude, longitude;

  const [sendData, setSendData] = useState({});

  // place를 이용한 장소 검색
  const searchPlace = (place) => {
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
  };

  useEffect(() => {
    if (place !== '' && place !== null && place.length > 1) {
      searchPlace(place);
    }
  }, [place]);

  const clearList = () => {
    setPlaceList([]);
  };

  const saveCoordinates = (event) => {
    name = event.target.getAttribute('name');
    longitude = event.target.getAttribute('x');
    latitude = event.target.getAttribute('y');
    setShopName(name);
    setSendData({ name, longitude, latitude });
    clearList();
  };

  const onCompleted = (data) => {
    const {
      createShop: { ok },
    } = data;
    if (ok) {
      setMessage('성공적으로 등록되었습니다.');
      setTimeout(() => navigate(routes.home), 1000);
    }
  };

  const removeShopName = () => {
    setShopName('');
  };

  const handleFileName = (event) => setFileName(event.target.files[0].name);

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
    let caption = '';
    for (let i = 1; i <= 5; i++) {
      if (data[i] !== undefined) {
        caption = caption + `#${data[i]}`;
      }
    }
    const { file, description } = data;
    const { name, latitude, longitude } = sendData;
    createShop({
      variables: {
        name,
        caption,
        longitude,
        latitude,
        description,
        file: file[0],
      },
    });
  };

  const { register, handleSubmit } = useForm({
    mode: 'onChange',
  });

  return (
    <CreateLayout>
      <PageTitle title="Add a shop" />
      <CreateShopBox>
        {message === '' ? (
          <CreateTitle>커피샵 추가하기</CreateTitle>
        ) : (
          <Message>{message}</Message>
        )}
        {message === '' ? (
          <form onSubmit={handleSubmit(onSubmitValid)}>
            <CreateInput
              ref={register}
              name="name"
              autocomplete="off"
              onChange={onPlace}
              disabled={shopName !== ''}
              type="text"
              placeholder="상호명 검색"
            />
            {placeList.length > 0 && shopName === '' ? (
              <ListBox>
                <ShopList>
                  {placeList.map((item) => (
                    <ShopName>
                      {item.place_name} - <Address>{item.address_name}</Address>{' '}
                      <SelectBtn
                        onClick={saveCoordinates}
                        x={item.x}
                        y={item.y}
                        name={item.place_name}
                        key={item.id}
                      >
                        선택
                      </SelectBtn>
                    </ShopName>
                  ))}
                </ShopList>
              </ListBox>
            ) : null}
            {shopName === '' ? null : (
              <SelectedShop>
                <FontAwesomeIcon
                  icon={faLocationDot}
                  color="orange"
                  size="2x"
                />
                <span>{shopName}</span>
                <FontAwesomeIcon
                  onClick={removeShopName}
                  icon={faX}
                  color="gray"
                  size="1x"
                  cursor="pointer"
                />
              </SelectedShop>
            )}

            <InputHashtagsBox>
              {hashTagArr.map((item, index) => (
                <InputHashtags key={index}>
                  <span>#</span>
                  <CreateInput
                    ref={register}
                    name={`${index + 1}`}
                    type="text"
                    placeholder="해쉬 태그"
                  />
                </InputHashtags>
              ))}
              <Notification message={maxhashTag} />
              <span onClick={handleHashtagNum}>해쉬태그 추가</span>
            </InputHashtagsBox>
            <UploadBox>
              <UploadName
                disabled
                placeholder={fileName === '' ? '사진 첨부' : fileName}
              />
              <label htmlFor="file">파일 찾기</label>
              <FileUpload
                id="file"
                onChange={handleFileName}
                ref={register}
                name="file"
                type="file"
                accept="image/*"
              />
            </UploadBox>
            <DescribeInput
              ref={register}
              name="description"
              type="text"
              placeholder="설명 작성"
            />
            {message === '' ? (
              <Button
                type="submit"
                value={loading ? 'Loading...' : '커피샵 추가'}
                disabled={loading || sendData.longitude === undefined}
              />
            ) : null}
          </form>
        ) : null}
      </CreateShopBox>
    </CreateLayout>
  );
}
export default CreateShop;
