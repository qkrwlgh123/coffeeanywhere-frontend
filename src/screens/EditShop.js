import { gql, useMutation, useQuery } from '@apollo/client';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { TOKEN } from '../apollo';
import PageTitle from '../components/PageTitle';
import InfoLayout from '../components/shop/InfoLayout';
import { DescribeInput, FileUpload } from './CreateShop';
import radioImg from '../radioImg.png';

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

const OpenBox = styled.div`
  label {
    font-size: 16px;
  }
  span {
    cursor: pointer;
  }
`;

const OpenTrue = styled.img`
  border: ${(props) => (props.open ? '7px solid black' : 'none')};
  border-radius: 100px;
`;

const OpenFalse = styled.img`
  border: ${(props) => (!props.open ? '7px solid black' : 'none')};
  border-radius: 100px;
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
  margin-left: 10px;
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

const DescribeInputBox = styled.div`
  @media (max-width: 800px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  span {
    font-size: 18px;
    padding: 10px;
    border-radius: 10px;
    margin-left: 10px;
    background-color: ${(props) => props.theme.accent};
    color: white;
    cursor: pointer;
    @media (max-width: 800px) {
      text-align: center;
      width: 15%;
    }
  }
`;

const ErrorBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 5px;
  margin-bottom: -19px;
`;

const ErrorMessage = styled.span`
  color: ${(props) => props.theme.accent};
`;

const PhotoList = styled.div`
  margin-top: 35px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 5px;
  @media (max-width: 800px) {
    display: flex;
    flex-direction: column;
  }
`;

const PhotoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  width: 90%;
  height: 30vh;
  padding: 5px;

  div {
    cursor: pointer;
    color: black;
    width: 10px;
    margin-right: 9px;
    margin-bottom: 9px;
    svg {
      pointer-events: none;
    }
  }
`;

const Photoimg = styled.img`
  width: 100%;
  height: 90%;
`;

const AddPhoto = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e5e7eb;
  width: 90%;
  height: 30vh;
  border-radius: 15px;
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
        description
        open
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

const EDIT_OPEN = gql`
  mutation editOpen($id: Int!, $open: Boolean) {
    editOpen(id: $id, open: $open) {
      ok
      error
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

const EDIT_DESCRIPTION = gql`
  mutation editDescription($id: Int!, $description: String) {
    editDescription(id: $id, description: $description) {
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

const DELETE_PHOTO = gql`
  mutation deletePhoto($id: Int) {
    deletePhoto(id: $id) {
      ok
      error
    }
  }
`;

function EditShop() {
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(
    '해쉬태그는 5개까지 입력이 가능합니다'
  );
  const [open, setOpen] = useState('');
  const [openMessage, setOpenMessage] = useState('');

  const [hashInput, setHashInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
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
        setDescriptionInput(data?.seeCoffeeShop?.shop?.description);
        setOpen(data.seeCoffeeShop.shop.open);
      }
    },
  });

  const [editOpen] = useMutation(EDIT_OPEN, { onCompleted: () => refetch() });

  const handleOpen = () => {
    if (open === data?.seeCoffeeShop?.shop.open) {
      setOpenMessage('설정이 변경되지 않았습니다');
    } else if (open) {
      editOpen({
        variables: {
          id: Number(id),
          open,
        },
      });
      setOpenMessage('해당 콘텐츠가 외부 게시물로 공개됩니다');
    } else if (!open) {
      editOpen({
        variables: {
          id: Number(id),
          open,
        },
      });
      setOpenMessage('해당 콘텐츠가 외부에 공개되지 않습니다');
    }
  };

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

  const [editDescription] = useMutation(EDIT_DESCRIPTION, {
    onCompleted: () => {
      setDescriptionInput('');
      refetch();
    },
  });

  const handleEditDescription = (event) => {
    setDescriptionInput(event.target.value);
  };

  const submitEdittedDescription = () => {
    editDescription({
      variables: {
        id: Number(id),
        description: descriptionInput,
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

  const [deletePhoto] = useMutation(DELETE_PHOTO, {
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

  const handleDeletePhoto = (event) => {
    event.stopPropagation();
    const params = event.target.getAttribute('params');
    deletePhoto({
      variables: {
        id: Number(params),
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

  // 주소-좌표 변환 객체를 생성
  const geocoder = new kakao.maps.services.Geocoder();

  function searchDetailAddrFromCoords(coords, callback) {
    // 좌표로 법정동 상세 주소 정보를 요청
    geocoder.coord2Address(coords.longitude, coords.latitude, callback);
  }
  // 좌표에 대한 주소정보를 표출하는 함수
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

          <ErrorMessage>{openMessage}</ErrorMessage>
          <OpenBox>
            <label>
              공개
              <input type="radio" />
              <OpenTrue
                open={open}
                onClick={() => setOpen(true)}
                src={radioImg}
                style={{ width: '13px' }}
              />
            </label>
            <label>
              비공개
              <input type="radio" />
              <OpenFalse
                open={open}
                onClick={() => setOpen(false)}
                src={radioImg}
                style={{ width: '13px' }}
              />
            </label>
            <span open={open} onClick={handleOpen}>
              변경
            </span>
          </OpenBox>
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
          <DescribeInputBox>
            <DescribeInput
              value={descriptionInput}
              onChange={handleEditDescription}
              placeholder="설명 작성"
            />
            <span onClick={submitEdittedDescription}>수정</span>
          </DescribeInputBox>

          <ErrorBox>
            <ErrorMessage>사진은 4장까지 등록 가능합니다.</ErrorMessage>
          </ErrorBox>
          <PhotoList>
            {photos.length > 0
              ? photos.map((item) => (
                  <PhotoBox key={item.id}>
                    <div params={item.id} onClick={handleDeletePhoto}>
                      <FontAwesomeIcon
                        params={item.id}
                        icon={faX}
                        color="gray"
                        size="1x"
                      />
                    </div>

                    <Photoimg src={item.url} />
                  </PhotoBox>
                ))
              : null}
            {photos.length < 4 ? (
              <AddPhoto>
                <label htmlFor="file">사진 추가</label>
                <FileUpload
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={addPhotoHandler}
                />
              </AddPhoto>
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
