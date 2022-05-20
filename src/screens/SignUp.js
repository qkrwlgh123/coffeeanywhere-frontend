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

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AvatarImg = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 75px;
`;

const Subtitle = styled(FatLink)`
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
`;

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $name: String!
    $username: String!
    $password: String!
    $email: String!
    $location: String
    $avatar: Upload
  ) {
    createAccount(
      name: $name
      username: $username
      password: $password
      email: $email
      location: $location
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
      setErrorMessage(error);
    } else {
      navigate(routes.login, {
        state: {
          message: 'Account created. Please log in!',
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
  };

  return (
    <AuthLayout>
      <PageTitle title="SignUp" />
      <FormBox>
        <HeaderContainer>
          <Title>Nomad Coffee</Title>
          <Subtitle>가입하고 전국 카페 정보를 얻어보세요.</Subtitle>
        </HeaderContainer>
        <ErrorBox>{errorMessage !== '' ? errorMessage : null}</ErrorBox>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <UploadBox>
            {prevAvatar && uploadAvatar ? (
              <AvatarImg src={prevAvatar} />
            ) : (
              <div>
                <label htmlFor="file">프로필 사진 등록</label>
                <FileUpload
                  id="file"
                  onChange={handleAddFile}
                  type="file"
                  accept="image/*"
                />
              </div>
            )}
          </UploadBox>
          <FormError message={errors?.name?.message} />
          <Input
            ref={register({
              required: 'Name is required.',
              minLength: {
                value: 2,
                message: '이름은 두 글자 이상 입력이 필요합니다.',
              },
            })}
            onChange={clearError}
            name="name"
            type="text"
            placeholder="이름"
          />
          <FormError message={errors?.username?.message} />
          <Input
            ref={register({
              required: 'Username is required.',
              minLength: {
                value: 2,
                message: '사용자명은 두 글자 이상 입력이 필요합니다.',
              },
            })}
            onChange={clearError}
            name="username"
            type="text"
            placeholder="사용자명(해당 정보로 소통하게 됩니다.)"
          />
          <FormError message={errors?.password?.message} />
          <Input
            ref={register({
              required: 'Password is required.',
              minLength: {
                value: 5,
                message: '비밀번호는 다섯 글자 이상 입력이 필요합니다.',
              },
            })}
            onChange={clearError}
            name="password"
            type="password"
            placeholder="비밀번호"
          />
          <FormError message={errors?.email?.message} />
          <Input
            ref={register({
              required: '이메일을 입력해주세요.',
            })}
            onChange={clearError}
            name="email"
            type="text"
            placeholder="이메일"
          />
          <FormError message={errors?.location?.message} />
          <Input
            ref={register({
              required: '현재 거주 중인 지역을 간략하게 입력해주세요.',
            })}
            onChange={clearError}
            name="location"
            type="text"
            placeholder="지역"
          />

          <Button
            type="submit"
            value={loading ? 'Loading...' : '회원가입'}
            disabled={!formState.isValid || loading}
          />
        </form>
      </FormBox>
      <BottomBox
        cta="이미 계정이 있으신가요?"
        linkText="로그인하러 가기"
        link={routes.login}
      />
    </AuthLayout>
  );
}
export default SignUp;
