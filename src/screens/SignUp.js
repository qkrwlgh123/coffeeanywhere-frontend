import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/auth/Button';
import Input from '../components/auth/input';
import FormBox from '../components/auth/FormBox';
import BottomBox from '../components/auth/BottomBox';
import routes from '../routes';
import styled from 'styled-components';
import { ErrorBox, FatLink, Title } from '../components/shared';
import PageTitle from '../components/PageTitle';
import { useForm } from 'react-hook-form';
import FormError from '../components/auth/FormError';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FileUpload, UploadBox } from './CreateShop';
import ProfileInfoLayout from '../components/shop/ProfileInfoLayout';
import { SearchInput } from './PublicList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';

export const AuthInput = styled(SearchInput)`
  width: 436px;
  height: 50px;
  font-size: 22px;
  margin-top: 16px;
`;

const UploadedBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  label {
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 9999px;
    background-color: #1f2937;
    margin-bottom: -40px;
    margin-right: -10px;
    z-index: 100;
  }
  svg {
    color: white;
  }
`;

const UnUploadedBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
  border-radius: 75px;
  border: 1px solid #9ca3af;
`;

const InputDescribeBox = styled.div`
  margin-top: 8px;
  padding: 4px;
  color: rgb(156, 163, 175);
  font-size: 16px;
  font-weight: 400;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const AvatarImg = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 75px;
`;

const Subtitle = styled(FatLink)`
  font-size: 16px;
  margin-top: 16px;
`;

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $name: String!
    $username: String!
    $password: String!
    $email: String!
    $description: String
    $avatar: Upload
  ) {
    createAccount(
      name: $name
      username: $username
      password: $password
      email: $email
      description: $description
      avatar: $avatar
    ) {
      ok
      error
    }
  }
`;

function SignUp() {
  const [errorMessage, setErrorMessage] = useState('');
  const [prevAvatar, setPrevAvatar] = useState('');
  const [uploadAvatar, setUploadAvatar] = useState('');
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    errors,
    formState,
    setError,
    clearErrors,
    getValues,
  } = useForm({
    mode: 'onChange',
  });

  const handleAddFile = (event) => {
    const reader = new FileReader();
    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
    reader.onloadend = () => {
      const base64Src = reader.result;
      const imgFile = event.target.files[0];
      setPrevAvatar(base64Src);
      setUploadAvatar(imgFile);
    };
  };

  const onCompleted = (data) => {
    const {
      createAccount: { ok, error },
    } = data;
    if (!ok) {
      setError('result', {
        message: error,
      });
      setErrorMessage('?????? ????????? ?????? ????????? ????????? ?????? ???????????????.');
    } else {
      navigate(routes.login, {
        state: {
          message: '??????????????? ???????????????! ?????????????????????!',
          username: getValues().username,
        },
      });
    }
  };
  const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });
  const onSubmitValid = (data) => {
    if (loading) {
      return true;
    }
    createAccount({
      variables: {
        ...data,
        avatar: uploadAvatar,
      },
    });
  };

  const clearError = () => {
    clearErrors('result');
    setErrorMessage('');
  };

  return (
    <ProfileInfoLayout>
      <PageTitle title="????????????" />
      <FormBox>
        <HeaderContainer>
          <Title>????????????</Title>
          <Subtitle>??????????????? ?????? ?????? ????????? ????????? ???????????????!</Subtitle>
        </HeaderContainer>

        <form onSubmit={handleSubmit(onSubmitValid)}>
          <UploadBox>
            {prevAvatar && uploadAvatar ? (
              <UploadedBox>
                <label htmlFor="file">
                  <FontAwesomeIcon icon={faImage} size="2x" />
                </label>
                <FileUpload
                  id="file"
                  onChange={handleAddFile}
                  type="file"
                  accept="image/*"
                />
                <div>
                  <AvatarImg src={prevAvatar} />
                </div>
              </UploadedBox>
            ) : (
              <UnUploadedBox>
                <label htmlFor="file">
                  <FontAwesomeIcon icon={faImage} size="2x" />
                </label>
                <FileUpload
                  id="file"
                  onChange={handleAddFile}
                  type="file"
                  accept="image/*"
                />
                <span>????????? ??????</span>
              </UnUploadedBox>
            )}
          </UploadBox>
          <AuthInput
            ref={register({
              required: '????????? ??????????????????.',
              minLength: {
                value: 2,
                message: '????????? ??? ?????? ?????? ????????? ???????????????.',
              },
            })}
            onChange={clearError}
            name="name"
            type="text"
            placeholder="??????"
          />
          <FormError message={errors?.name?.message} />
          <AuthInput
            ref={register({
              required: '??????????????? ??????????????????.',
              minLength: {
                value: 2,
                message: '??????????????? ??? ?????? ?????? ????????? ???????????????.',
              },
            })}
            onChange={clearError}
            name="username"
            type="text"
            placeholder="????????? ??????"
          />
          <FormError message={errors?.username?.message} />
          <InputDescribeBox>
            Coffee anywhere?????? ????????? ???????????????.
          </InputDescribeBox>
          <AuthInput
            ref={register({
              required: '??????????????? ??????????????????.',
              minLength: {
                value: 5,
                message: '??????????????? ?????? ?????? ?????? ????????? ???????????????.',
              },
            })}
            onChange={clearError}
            name="password"
            type="password"
            placeholder="????????????"
          />
          <FormError message={errors?.password?.message} />

          <AuthInput
            ref={register({
              required: '???????????? ??????????????????.',
            })}
            onChange={clearError}
            name="email"
            type="text"
            placeholder="?????????"
          />
          <FormError message={errors?.email?.message} />
          <AuthInput
            ref={register}
            onChange={clearError}
            name="description"
            type="text"
            placeholder="?????????"
          />
          <InputDescribeBox>
            ???????????? ????????? ????????? ??????????????????.
          </InputDescribeBox>
          <ErrorBox active={errorMessage !== ''}>
            {errorMessage !== '' ? errorMessage : null}
          </ErrorBox>
          <Button
            type="submit"
            value={loading ? 'Loading...' : '????????????'}
            disabled={!formState.isValid || loading}
          />
        </form>
      </FormBox>
    </ProfileInfoLayout>
  );
}
export default SignUp;
