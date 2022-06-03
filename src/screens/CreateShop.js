import PageTitle from '../components/PageTitle';
import styled from 'styled-components';

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
import {
  faCamera,
  faLocationDot,
  faX,
} from '@fortawesome/free-solid-svg-icons';
import { HashtagBox, Message } from './ShopInfo';

import radioImg from '../radioImg.png';

const { kakao } = window;

export const Title = styled.span`
  font-size: 24px;
  font-weight: 550;
  margin-top: 50px;
  margin-bottom: 20px;
`;

export const CreateInput = styled.input`
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
`;

export const ShopList = styled.ul``;

export const ShopName = styled.li`
  font-size: 18px;
  margin: 10px 0px;
`;

export const DescribeInput = styled.input`
  width: 90%;
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

export const InputHashtagsBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: -25px;
`;

export const Hashtag = styled.div`
  display: flex;
  border-radius: 5px;
  padding: 10px;
  font-weight: 600;
  font-size: 16px;
  margin-right: 10px;
  background-color: #e5e7eb;
  span:first-child {
    margin-right: 10px;
  }
  div {
    cursor: pointer;
    margin-right: -1px;
    svg {
      pointer-events: none;
    }
  }
`;

export const AddHashTag = styled.span`
  cursor: pointer;
  margin-left: 10px;
  font-size: 18px;
  padding: 10px;
  border-radius: 5px;
  border: 0.5px solid rgba(219, 219, 219, 1);
  pointer-events: ${(props) => (props.length >= 5 ? 'none' : 'auto')};
  opacity: ${(props) => (props.length >= 5 ? 0.4 : 1)};
`;

export const UploadBox = styled.div`
  display: flex;
  width: 19%;
  label {
    color: rgb(38, 38, 38);
    border: 0.5px solid rgba(219, 219, 219, 1);
    cursor: pointer;
    font-size: 15px;
    padding: 10px;
    width: 150px;
    height: 150px;
    border-radius: 75px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      margin-left: 5px;
    }
  }
`;

export const PhotoPrevBox = styled.div`
  display: flex;
  img {
    margin: 0px 5px;
  }
`;

export const PrevPhoto = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  div:first-child {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: black;
    width: 15px;
    height: 15px;
    border-radius: 15px;
    padding: 13px;
    opacity: 0.7;
    position: relative;
    left: 10px;
    margin-bottom: -10px;
    cursor: pointer;
    svg {
      pointer-events: none;
    }
  }
  margin: 0px 15px;
  img {
    margin: 0px;
    border-radius: 5px;
  }
`;

export const RepresentPhoto = styled.div`
  text-align: center;
  background-color: black;
  opacity: 0.8;
  color: white;
  width: 150px;
  margin-top: -29px;
  padding: 8px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;

export const PrevPhotoLength = styled.span`
  color: ${(props) => (props.length > 0 ? 'orange' : 'black')};
`;

export const FileUpload = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  padding: 0;
  overflow: hidden;
  border: 0;
`;

export const BtnBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

export const OpenBox = styled.div`
  display: flex;
  flex-direction: column;
  label {
    display: flex;
    align-items: center;
    font-size: 20px;
    margin-bottom: 15px;
    img {
      cursor: pointer;
      margin-right: 7px;
    }
  }
  span {
    cursor: pointer;
  }
`;

export const Open = styled.img`
  border: ${(props) => (props.open ? '10px solid black' : 'none')};

  border-radius: 100px;
  width: 20px;
`;

const CREATE_SHOP_MUTATION = gql`
  mutation createShop(
    $name: String!
    $caption: String
    $longitude: String
    $latitude: String
    $description: String
    $open: Boolean
    $address: String
    $file: [Upload]
  ) {
    createShop(
      name: $name
      caption: $caption
      longitude: $longitude
      latitude: $latitude
      description: $description
      open: $open
      address: $address
      file: $file
    ) {
      ok
      error
    }
  }
`;

function CreateShop() {
  const navigate = useNavigate();

  const [hashTag, setHashTag] = useState('');
  const [hashTagArr, setHashTagArr] = useState([]);

  const [photoPrevArr, setPhotoPrevArr] = useState([]);
  const [photoUploadArr, setPhotoUploadArr] = useState([]);

  const [completeMessage, setCompleteMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [place, setPlace] = useState('');
  const [shopName, setShopName] = useState('');

  const [open, setOpen] = useState(true);

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

  let name, latitude, longitude, address;

  const saveCoordinates = (event) => {
    name = event.target.getAttribute('name');
    longitude = event.target.getAttribute('x');
    latitude = event.target.getAttribute('y');
    address = event.target.getAttribute('z');
    setShopName(name);
    setSendData({ name, longitude, latitude, address });
    clearList();
  };

  const onCompleted = (data) => {
    const {
      createShop: { ok },
    } = data;
    if (ok) {
      setCompleteMessage('성공적으로 등록되었습니다.');
      setTimeout(() => navigate(routes.home), 1000);
    }
  };

  const removeShopName = () => {
    setShopName('');
  };

  const handleHashTag = (event) => {
    setErrorMessage('');
    setHashTag(event.target.value);
  };

  const handleAddHashTag = () => {
    if (hashTag === '') {
      setErrorMessage('해쉬태그를 한 글자 이상 입력해주세요.');
      return;
    } else if (hashTagArr.includes(hashTag)) {
      setErrorMessage('중복된 해쉬태그입니다.');
      return;
    }
    setHashTagArr([...hashTagArr, hashTag]);
    setHashTag('');
  };

  const handleDeleteHashTag = (event) => {
    const deleteObj = Number(event.target.getAttribute('index'));
    setHashTagArr(hashTagArr.filter((_, index) => index !== deleteObj));
  };

  const handleAddFile = (event) => {
    const reader = new FileReader();
    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
    reader.onloadend = () => {
      const base64Src = reader.result;
      const imgFile = event.target.files[0];
      setPhotoPrevArr([...photoPrevArr, base64Src]);
      setPhotoUploadArr([...photoUploadArr, imgFile]);
    };
  };

  const handleDeleteFile = (event) => {
    const deletedIndex = Number(event.target.getAttribute('index'));
    setPhotoPrevArr(photoPrevArr.filter((_, index) => index !== deletedIndex));
    setPhotoUploadArr(
      photoUploadArr.filter((_, index) => index !== deletedIndex)
    );
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
    let caption = '';
    for (let i in hashTagArr) {
      caption = caption + `#${hashTagArr[i]}`;
    }
    const { description } = data;
    const { name, latitude, longitude, address } = sendData;

    createShop({
      variables: {
        name,
        caption,
        longitude,
        latitude,
        address,
        description,
        open,
        file: photoUploadArr,
      },
    });
  };

  const { register, handleSubmit } = useForm({
    mode: 'onChange',
  });

  return (
    <CreateLayout>
      <PageTitle title="커피샵 추가" />
      <CreateShopBox>
        <Message>{completeMessage}</Message>
        {completeMessage === '' ? (
          <form
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
              }
            }}
            onSubmit={handleSubmit(onSubmitValid)}
          >
            <Title>상호명 검색하기</Title>
            <CreateInput
              ref={register}
              name="name"
              autocomplete="off"
              onChange={onPlace}
              disabled={shopName !== ''}
              type="text"
              placeholder="알고 있는 커피샵을 검색해보세요."
            />
            {placeList.length > 0 && shopName === '' ? (
              <ListBox>
                <ShopList>
                  {placeList.map((item) => (
                    <ShopName key={item.id} a={item.id}>
                      {item.place_name} -{' '}
                      <Address>{item.road_address_name}</Address>
                      <SelectBtn
                        onClick={saveCoordinates}
                        name={item.place_name}
                        x={item.x}
                        y={item.y}
                        z={item.road_address_name}
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
            <Title>관련 키워드</Title>
            <Notification message={errorMessage} />
            <InputHashtagsBox>
              <CreateInput
                value={hashTag}
                onChange={handleHashTag}
                placeholder="태그를 입력하세요."
                disabled={hashTagArr.length >= 5}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    handleAddHashTag();
                  }
                }}
              />
              <AddHashTag length={hashTagArr.length} onClick={handleAddHashTag}>
                추가
              </AddHashTag>
            </InputHashtagsBox>
            <HashtagBox>
              {hashTagArr.length !== 0
                ? hashTagArr.map((item, index) => (
                    <Hashtag key={item}>
                      <span>#{item}</span>
                      <div index={index} onClick={handleDeleteHashTag}>
                        <FontAwesomeIcon icon={faX} color="gray" size="xs" />
                      </div>
                    </Hashtag>
                  ))
                : null}
            </HashtagBox>
            <Title>사진 등록</Title>
            <UploadBox>
              <label htmlFor="file">
                <FontAwesomeIcon icon={faCamera} color="black" size="1x" />
                <span>
                  <PrevPhotoLength length={photoPrevArr.length}>
                    {photoPrevArr.length}
                  </PrevPhotoLength>
                  /4
                </span>
              </label>
              <FileUpload
                id="file"
                ref={register}
                onChange={handleAddFile}
                name="file"
                type="file"
                accept="image/*"
                disabled={photoPrevArr.length >= 4}
              />
            </UploadBox>
            <PhotoPrevBox>
              {photoPrevArr.map((item, index) =>
                index === 0 ? (
                  <PrevPhoto key={index}>
                    <div index={index} onClick={handleDeleteFile}>
                      <FontAwesomeIcon icon={faX} color="white" size="1x" />
                    </div>
                    <img
                      src={item}
                      style={{ width: '150px', height: '150px' }}
                    />
                    <RepresentPhoto>대표 사진</RepresentPhoto>
                  </PrevPhoto>
                ) : (
                  <PrevPhoto key={index}>
                    <div index={index} onClick={handleDeleteFile}>
                      <FontAwesomeIcon icon={faX} color="white" size="1x" />
                    </div>
                    <img
                      src={item}
                      style={{ width: '150px', height: '150px' }}
                    />
                  </PrevPhoto>
                )
              )}
            </PhotoPrevBox>
            <Title>커피숍 설명 작성</Title>
            <DescribeInput
              ref={register}
              name="description"
              type="text"
              placeholder="설명을 작성하세요."
            />
            <Title>공개</Title>
            <OpenBox>
              <label>
                <input type="radio" />
                <Open
                  open={open}
                  src={radioImg}
                  onClick={() => setOpen(true)}
                  style={{ width: '20px' }}
                />
                외부에 공개
              </label>
              <label>
                <input type="radio" />
                <Open
                  open={!open}
                  src={radioImg}
                  onClick={() => setOpen(false)}
                  style={{ width: '20px' }}
                />
                나만 보기
              </label>
            </OpenBox>
            <BtnBox>
              {completeMessage === '' ? (
                <Button
                  type="submit"
                  value={loading ? 'Loading...' : '커피샵 추가'}
                  disabled={loading || sendData.longitude === undefined}
                />
              ) : null}
            </BtnBox>
          </form>
        ) : null}
      </CreateShopBox>
    </CreateLayout>
  );
}
export default CreateShop;
