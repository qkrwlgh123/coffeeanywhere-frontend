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
import { useLocation } from 'react-router-dom';
import Notification from '../components/auth/Notification';
import FormError from '../components/auth/FormError';
import { gql, useMutation } from '@apollo/client';
import { loggedId, logUserIn } from '../apollo';
import { useState } from 'react';

const FacebookLogin = styled.div`
  color: #385285;
  span {
    margin-left: 10px;
    font-weight: 600;
  }
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

function Login() {
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
    <AuthLayout>
      <PageTitle title="Login" />
      <FormBox>
        <div>
          <Title>Nomad Coffee</Title>
        </div>
        <Notification message={location?.state?.message} />
        <ErrorBox>{errorMessage !== '' ? errorMessage : null}</ErrorBox>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <FormError message={errors?.username?.message} />
          <Input
            ref={register({
              required: 'Username is required.',
              minLength: {
                value: 3,
                message: 'Username sholud be longer than 3 chars.',
              },
            })}
            onChange={onClearErrors}
            name="username"
            type="text"
            placeholder="Username"
          />
          <FormError message={errors?.password?.message} />
          <Input
            ref={register({
              required: 'Password is required.',
              minLength: {
                value: 5,
                message: 'Password should be longer than 5 chars.',
              },
            })}
            onChange={onClearErrors}
            name="password"
            type="password"
            placeholder="Password"
          />
          <Button
            type="submit"
            value={loading ? 'Loading..' : 'Log in'}
            disabled={!formState.isValid || loading}
          />
        </form>
        <Separator />
        <FacebookLogin>
          <FontAwesomeIcon icon={faFacebookSquare} />
          <span>Log in with Facebook</span>
        </FacebookLogin>
      </FormBox>
      <BottomBox
        cta="Don't have an account?"
        linkText="Sign up"
        link={routes.signUp}
      />
    </AuthLayout>
  );
}
export default Login;
