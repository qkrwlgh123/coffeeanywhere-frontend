import { gql, useMutation, useQuery } from '@apollo/client';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { TOKEN } from '../apollo';
import PageTitle from '../components/PageTitle';
import InfoLayout from '../components/shop/InfoLayout';
import routes from '../routes';
import { FileUpload, UploadBox } from './CreateShop';

const { kakao } = window;

const InfoBox = styled.div`
  margin-top: 5%;
  width: 80%;
  padding: 15px;
  background-color: #ffffff;
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
  font-weight: 400;
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
`;

const Hasgtag = styled.div`
  display: flex;
  border-radius: 5px;
  padding: 10px;
  font-weight: 600;
  font-size: 16px;
  margin-right: 10px;
  background-color: #e5e7eb;
  span:first-child {
    margin-right: 7px;
  }
  div {
    cursor: pointer;
    svg {
      pointer-events: none;
    }
  }
`;

const HasgtagInputBox = styled.div`
  display: flex;
  border-radius: 5px;
  padding: 10px;
  font-weight: 600;
  font-size: 16px;
  margin-right: 10px;
  background-color: #e5e7eb;
  align-items: center;
  width: 19%;
  span {
    margin-right: 2px;
  }
`;

const HasgtagInput = styled.input`
  width: 100%;
`;

const ErrorBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 5px;
  margin-bottom: -19px;
`;

const EmptyBox = styled.div`
  width: 0%;
`;

const ErrorMessage = styled.span`
  color: ${(props) => props.theme.accent};
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
  div {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      cursor: pointer;
      font-size: 16px;
    }
  }
`;

const Photoimg = styled.img`
  width: 100%;
  height: 100%;
`;

const AddPhoto = styled.div`
  label {
    cursor: pointer;
    font-weight: 500;
    font-size: 16px;
  }
`;

export const Message = styled.span`
  position: absolute;
  top: 45%;
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
          id
          url
        }
        categories {
          id
          name
        }
      }
    }
  }
`;

const ADD_HASHTAG = gql`
  mutation addCategory($id: Int!, $name: String!) {
    addCategory(id: $id, name: $name) {
      ok
      error
    }
  }
`;

const DELETE_HASHTAG = gql`
  mutation deleteCategory($id: Int) {
    deleteCategory(id: $id) {
      ok
      error
    }
  }
`;

const ADD_PHOTO = gql`
  mutation addPhoto($id: Int, $file: Upload) {
    addPhoto(id: $id, file: $file) {
      ok
      error
    }
  }
`;

function EditShop() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(
    '해쉬태그는 5개까지 입력이 가능합니다'
  );
  const [hashInput, setHashInput] = useState('');
  const [list, setList] = useState([]);
  const [address, setAddress] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const { id } = useParams();
  const { data, refetch } = useQuery(SHOP_QUERY, {
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

  const handleHashInput = (event) => {
    setHashInput(event.target.value);
  };

  const submitHashInput = (event) => {
    if (event.key === 'Enter') {
      for (let i in categories) {
        if (categories[i].name === `#${hashInput}`) {
          setErrorMessage('중복된 해쉬태그입니다.');
          return;
        }
      }
      addCategory({
        variables: {
          id: Number(id),
          name: hashInput,
        },
      });
    }
  };

  const handleDeleteCategory = (event) => {
    event.stopPropagation();
    const params = event.target.getAttribute('params');
    deleteCategory({
      variables: {
        id: Number(params),
      },
    });
  };

  const [addPhoto] = useMutation(ADD_PHOTO, {
    context: {
      headers: {
        token: localStorage.getItem(TOKEN),
      },
    },
    onCompleted: () => refetch(),
  });

  const addPhotoHandler = (event) => {
    addPhoto({
      variables: {
        id: Number(id),
        file: event.target.files[0],
      },
    });
  };

  const [addCategory, { loading }] = useMutation(ADD_HASHTAG, {
    context: {
      headers: {
        token: localStorage.getItem(TOKEN),
      },
    },
    onCompleted: () => {
      setHashInput('');
      setErrorMessage('해쉬태그는 5개까지 입력이 가능합니다');
      refetch();
    },
  });

  const [deleteCategory] = useMutation(DELETE_HASHTAG, {
    onCompleted: () => refetch(),
  });

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
      {message === '' ? (
        <InfoBox>
          <TitleBox>
            <Name>{list?.name}</Name>
            <Addr>{space ? space : null}</Addr>
            <Buttons>
              <Link to={`/${id}`} reloadDocument>
                <span>완료</span>
              </Link>
            </Buttons>
          </TitleBox>
          <ErrorBox>
            <ErrorMessage>{errorMessage}</ErrorMessage>
          </ErrorBox>
          <HashtagBox>
            {categories.length !== 0
              ? categories.map((item) => (
                  <Hasgtag key={item.name}>
                    <span>{item.name}</span>
                    <div params={item.id} onClick={handleDeleteCategory}>
                      <FontAwesomeIcon
                        params={item.id}
                        icon={faX}
                        color="gray"
                        size="xs"
                      />
                    </div>
                  </Hasgtag>
                ))
              : null}
            {categories?.length < 5 ? (
              <HasgtagInputBox>
                <span>#</span>
                <HasgtagInput
                  value={hashInput}
                  onChange={handleHashInput}
                  onKeyPress={submitHashInput}
                  placeholder="해쉬태그 입력 후 enter"
                />
              </HasgtagInputBox>
            ) : null}
          </HashtagBox>
          <ErrorBox>
            <ErrorMessage>사진은 4장까지 등록 가능합니다.</ErrorMessage>
          </ErrorBox>
          <PhotoList>
            {photos.length > 0
              ? photos.map((item) => (
                  <PhotoBox key={item.id}>
                    <Photoimg src={item.url} />
                  </PhotoBox>
                ))
              : null}
            {photos.length < 4 ? (
              <PhotoBox>
                <AddPhoto>
                  <label htmlFor="file">사진 추가</label>
                  <FileUpload
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={addPhotoHandler}
                  />
                </AddPhoto>
              </PhotoBox>
            ) : null}
          </PhotoList>
        </InfoBox>
      ) : (
        <Message>{message}</Message>
      )}
    </InfoLayout>
  );
}
export default EditShop;
