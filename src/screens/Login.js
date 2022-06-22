import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/auth/Button';
import Separator from '../components/auth/Separator';
import Input from '../components/auth/input';
import FormBox from '../components/auth/FormBox';
import BottomBox from '../components/auth/BottomBox';
import routes from '../routes';
import PageTitle from '../components/PageTitle';
import { useForm } from 'react-hook-form';
import { ErrorBox, Title } from '../components/shared';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Notification from '../components/auth/Notification';
import FormError from '../components/auth/FormError';
import { gql, useMutation } from '@apollo/client';
import { loggedId, logUserIn } from '../apollo';
import { useState } from 'react';
import ProfileInfoLayout from '../components/shop/ProfileInfoLayout';
import { AuthInput } from './SignUp';
import kakao_login_img from '../../src/images/kakao_login_medium_narrow.png';

window.Kakao.init(process.env.REACT_APP_KAKAO);

const TitleBox = styled.div`
  margin-bottom: 50px;
`;

const KakaoBtn = styled.img`
  width: 200px;
  height: 50px;
  text-align: center;
  background-color: yellow;
  color: black;
  cursor: pointer;
`;

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      name
      token
      error
    }
  }
`;

const KAKAO_LOGIN_MUTATION = gql`
  mutation kakaoLogin($username: String, $avatar: String, $email: String) {
    kakaoLogin(username: $username, avatar: $avatar, email: $email) {
      ok
      token
      error
    }
  }
`;

function Login() {
  const handleKakaoLogin = () => {
    window.Kakao.Auth.login({
      success: function (response) {
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: function (response) {
            kakaoLogin({
              variables: {
                username: response.properties.nickname,
                email: response.kakao_account.email,
                avatar: response.properties.profile_image,
              },
              onCompleted: (data) => {
                console.log('완료', data);
                const {
                  kakaoLogin: { ok, token, error },
                } = data;
                if (token) {
                  logUserIn(token);
                }
              },
            });
          },
          fail: function (error) {
            console.log(error);
          },
        });
      },
      fail: function (error) {
        console.log(error);
      },
    });
  };

  const [errorMessage, setErrorMessage] = useState('');

  const location = useLocation();

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
    defaultValues: {
      username: location?.state?.username || '',
    },
  });

  const onCompleted = (data) => {
    const {
      login: { ok, name, token, error },
    } = data;
    if (!ok) {
      setError('result', {
        message: error,
      });
      setErrorMessage(error);
    }
    if (token) {
      logUserIn(token, name);
    }
  };
  const [login, { loading }] = useMutation(LOGIN_MUTATION, { onCompleted });
  const [kakaoLogin, {}] = useMutation(KAKAO_LOGIN_MUTATION);

  const onSubmitValid = (data) => {
    if (loading) {
      return;
    }
    const { username, password } = getValues();
    login({
      variables: {
        username,
        password,
      },
    });
  };
  const onClearErrors = () => {
    clearErrors('result');
  };

  return (
    <ProfileInfoLayout>
      <PageTitle title="로그인" />
      <FormBox>
        <TitleBox>
          <Title>로그인</Title>
        </TitleBox>
        <Notification message={location?.state?.message} />
        <ErrorBox>{errorMessage !== '' ? errorMessage : null}</ErrorBox>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <FormError message={errors?.username?.message} />
          <AuthInput
            ref={register({
              required: '사용자 이름을 입력해주세요.',
            })}
            onChange={onClearErrors}
            name="username"
            type="text"
            placeholder="사용자 이름"
          />
          <FormError message={errors?.password?.message} />
          <AuthInput
            ref={register({
              required: '비밀번호를 입력해주세요.',
            })}
            onChange={onClearErrors}
            name="password"
            type="password"
            placeholder="비밀번호"
          />
          <ErrorBox active={errorMessage !== ''}>
            {errorMessage !== '' ? errorMessage : null}
          </ErrorBox>
          <Button
            type="submit"
            value={loading ? 'Loading..' : '로그인'}
            disabled={!formState.isValid || loading}
          />
          <KakaoBtn src={kakao_login_img} onClick={handleKakaoLogin} />
        </form>
        <Separator />
      </FormBox>
      <BottomBox
        cta="계정이 없으신가요?"
        linkText="회원가입"
        link={routes.signUp}
      />
    </ProfileInfoLayout>
  );
}
export default Login;
