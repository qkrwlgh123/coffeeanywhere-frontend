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
      setErrorMessage('해당 이메일 또는 사용자 이름은 이미 존재합니다.');
    } else {
      navigate(routes.login, {
        state: {
          message: '회원가입을 축하합니다! 로그인해주세요!',
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
      <PageTitle title="회원가입" />
      <FormBox>
        <HeaderContainer>
          <Title>회원가입</Title>
          <Subtitle>가입하시고 전국 카페 정보를 손쉽게 얻어보세요!</Subtitle>
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
                <span>프로필 사진</span>
              </UnUploadedBox>
            )}
          </UploadBox>
          <AuthInput
            ref={register({
              required: '이름을 입력해주세요.',
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
          <FormError message={errors?.name?.message} />
          <AuthInput
            ref={register({
              required: '사용자명을 입력해주세요.',
              minLength: {
                value: 2,
                message: '사용자명은 두 글자 이상 입력이 필요합니다.',
              },
            })}
            onChange={clearError}
            name="username"
            type="text"
            placeholder="사용자 이름"
          />
          <FormError message={errors?.username?.message} />
          <InputDescribeBox>
            Coffee anywhere에서 사용할 이름입니다.
          </InputDescribeBox>
          <AuthInput
            ref={register({
              required: '비밀번호를 입력해주세요.',
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
          <FormError message={errors?.password?.message} />

          <AuthInput
            ref={register({
              required: '이메일을 입력해주세요.',
            })}
            onChange={clearError}
            name="email"
            type="text"
            placeholder="이메일"
          />
          <FormError message={errors?.email?.message} />
          <AuthInput
            ref={register}
            onChange={clearError}
            name="description"
            type="text"
            placeholder="소개글"
          />
          <InputDescribeBox>
            프로필에 표시될 간단한 소개글입니다.
          </InputDescribeBox>
          <ErrorBox active={errorMessage !== ''}>
            {errorMessage !== '' ? errorMessage : null}
          </ErrorBox>
          <Button
            type="submit"
            value={loading ? 'Loading...' : '회원가입'}
            disabled={!formState.isValid || loading}
          />
        </form>
      </FormBox>
    </ProfileInfoLayout>
  );
}
export default SignUp;
