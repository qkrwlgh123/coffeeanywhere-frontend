import { faCamera, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import {
  AddHashTag,
  BtnBox,
  CreateInput,
  DescribeInput,
  FileUpload,
  Hashtag,
  InputHashtagsBox,
  PhotoPrevBox,
  PrevPhoto,
  PrevPhotoLength,
  RepresentPhoto,
  UploadBox,
  UploadPhotoBox,
} from './CreateShop';
import radioImg from '../images/radioImg.png';
import { Open, OpenBox } from './CreateShop';
import CreateLayout from '../components/shop/CreateLayout';
import { useForm } from 'react-hook-form';
import CreateShopBox from '../components/shop/CreateShopBox';
import { Title } from './CreateShop';
import Notification from '../components/auth/Notification';
import { HashtagBox, Message } from './ShopInfo';
import Button from '../components/auth/Button';
import { gql, useMutation, useQuery } from '@apollo/client';
import { TOKEN } from '../apollo';

const SHOP_QUERY = gql`
  query seeCoffeeShop($id: Int!) {
    seeCoffeeShop(id: $id) {
      ok
      error
      shop {
        name
        description
        categories {
          name
        }
        open
        photos {
          url
        }
      }
    }
  }
`;

const EDIT_SHOP_MUTATION = gql`
  mutation editCoffeeShop(
    $id: Int!
    $caption: String
    $description: String
    $open: Boolean
    $file: [Upload]
    $deleteFromS3: [String]
  ) {
    editCoffeeShop(
      id: $id
      caption: $caption
      description: $description
      open: $open
      file: $file
      deleteFromS3: $deleteFromS3
    ) {
      ok
      error
    }
  }
`;

function EditShop() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [hashTag, setHashTag] = useState('');
  const [hashTagArr, setHashTagArr] = useState([]);

  const [photoPrevArr, setPhotoPrevArr] = useState([]);
  const [photoUploadArr, setPhotoUploadArr] = useState([]);
  const [photoDeleteArr, setPhotoDeleteArr] = useState([]);

  const [completeMessage, setCompleteMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [open, setOpen] = useState('');

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
        setHashTagArr(
          data?.seeCoffeeShop?.shop?.categories?.map(
            (item) => item.name.split('#')[1]
          )
        );
        setOpen(data?.seeCoffeeShop?.shop?.open);
        setPhotoPrevArr(
          data?.seeCoffeeShop?.shop?.photos?.map((item) => item.url)
        );
        setPhotoUploadArr(
          data?.seeCoffeeShop?.shop?.photos?.map((item) => item.url)
        );
      }
    },
  });

  const onCompleted = (data) => {
    const {
      editCoffeeShop: { ok },
    } = data;
    if (ok) {
      setCompleteMessage('??????????????? ?????????????????????.');
      setTimeout(() => navigate(`/${id}`), 1000);
    }
  };

  const [editCoffeeShop, { loading }] = useMutation(EDIT_SHOP_MUTATION, {
    onCompleted,
    context: {
      headers: {
        token: localStorage.getItem(TOKEN),
      },
    },
  });

  const handleHashTag = (event) => {
    setErrorMessage('');
    setHashTag(event.target.value);
  };

  const handleAddHashTag = () => {
    if (hashTag === '') {
      setErrorMessage('??????????????? ??? ?????? ?????? ??????????????????.');
      return;
    } else if (hashTagArr.includes(hashTag)) {
      setErrorMessage('????????? ?????????????????????.');
      return;
    }
    setHashTagArr([...hashTagArr, hashTag]);
    setHashTag('');
  };

  const handleDeleteHashTag = (event) => {
    const deleteObj = event.target.getAttribute('a');
    setHashTagArr(hashTagArr.filter((item) => item !== deleteObj));
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
    const file = photoUploadArr[deletedIndex];
    if (typeof file === 'object') {
      setPhotoPrevArr(
        photoPrevArr.filter((_, index) => index !== deletedIndex)
      );
      setPhotoUploadArr(
        photoUploadArr.filter((_, index) => index !== deletedIndex)
      );
    } else {
      setPhotoDeleteArr([...photoDeleteArr, file]);
      setPhotoPrevArr(
        photoPrevArr.filter((_, index) => index !== deletedIndex)
      );
      setPhotoUploadArr(
        photoUploadArr.filter((_, index) => index !== deletedIndex)
      );
    }
  };

  const { register, handleSubmit } = useForm({
    mode: 'onChange',
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

    editCoffeeShop({
      variables: {
        id: Number(id),
        caption,
        description,
        open,
        file: photoUploadArr,
        deleteFromS3: photoDeleteArr,
      },
    });
  };

  return (
    <CreateLayout>
      <PageTitle title="????????? ?????? ??????" />
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
            <Title>?????? ?????????</Title>
            <Notification message={errorMessage} />
            <InputHashtagsBox>
              <CreateInput
                value={hashTag}
                onChange={handleHashTag}
                placeholder="????????? ???????????????."
                disabled={hashTagArr.length >= 5}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    handleAddHashTag();
                  }
                }}
              />
              <AddHashTag length={hashTagArr.length} onClick={handleAddHashTag}>
                ??????
              </AddHashTag>
            </InputHashtagsBox>
            <HashtagBox>
              {hashTagArr.length !== 0
                ? hashTagArr.map((item, index) => (
                    <div key={item}>
                      <div>#{item}</div>
                      <div a={item} onClick={handleDeleteHashTag}>
                        <FontAwesomeIcon icon={faX} size="xs" />
                      </div>
                    </div>
                  ))
                : null}
            </HashtagBox>
            <Title>?????? ??????</Title>
            <UploadPhotoBox>
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
            </UploadPhotoBox>
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
                    <RepresentPhoto>?????? ??????</RepresentPhoto>
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
            <Title>????????? ?????? ??????</Title>
            <DescribeInput
              ref={register}
              name="description"
              defaultValue={data?.seeCoffeeShop?.shop?.description}
              type="text"
              placeholder="????????? ???????????????."
            />
            <Title>??????</Title>
            <OpenBox>
              <label>
                <input type="radio" />
                <Open
                  open={open}
                  src={radioImg}
                  onClick={() => setOpen(true)}
                  style={{ width: '20px' }}
                />
                ????????? ??????
              </label>
              <label>
                <input type="radio" />
                <Open
                  open={!open}
                  src={radioImg}
                  onClick={() => setOpen(false)}
                  style={{ width: '20px' }}
                />
                ?????? ??????
              </label>
            </OpenBox>
            <BtnBox>
              {completeMessage === '' ? (
                <Button
                  type="submit"
                  value={loading ? 'Loading...' : '?????? ??????'}
                  disabled={loading}
                />
              ) : null}
            </BtnBox>
          </form>
        ) : null}
      </CreateShopBox>
    </CreateLayout>
  );
}
export default EditShop;
