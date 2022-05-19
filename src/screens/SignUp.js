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

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
    $email: String!
    $location: String!
    $githubUsername: String!
    $password: String!
  ) {
    createAccount(
      name: $name
      username: $username
      email: $email
      location: $location
      githubUsername: $githubUsername
      password: $password
    ) {
      ok
      error
    }
  }
`;

function SignUp() {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const {
    register,
    watch,
    handleSubmit,
    errors,
    formState,
    setError,
    clearErrors,
    getValues,
  } = useForm({
    mode: 'onChange',
  });

  const onCompleted = (data) => {
    const {
      createAccount: { ok, error },
    } = data;
    if (!ok) {
      console.log(error);
      setError('result', {
        message: error,
      });
      setErrorMessage(error);
    } else {
      navigate(routes.home, {
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
          <Subtitle>Sign up to see coffee shops in Korea!</Subtitle>
        </HeaderContainer>
        <ErrorBox>{errorMessage !== '' ? errorMessage : null}</ErrorBox>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <FormError message={errors?.name?.message} />
          <Input
            ref={register({
              required: 'Name is required.',
              minLength: {
                value: 3,
                message: 'Name should be longer than 3 chars.',
              },
            })}
            onChange={clearError}
            name="name"
            type="text"
            placeholder="Name"
          />
          <FormError message={errors?.username?.message} />
          <Input
            ref={register({
              required: 'Username is required.',
              minLength: {
                value: 3,
                message: 'Username should be longer than 3 chars.',
              },
            })}
            onChange={clearError}
            name="username"
            type="text"
            placeholder="Username"
          />
          <FormError message={errors?.email?.message} />
          <Input
            ref={register({
              required: 'Email is required.',
            })}
            onChange={clearError}
            name="email"
            type="text"
            placeholder="Email"
          />
          <FormError message={errors?.location?.message} />
          <Input
            ref={register({
              required: 'Location is required.',
            })}
            onChange={clearError}
            name="location"
            type="text"
            placeholder="Location"
          />
          <FormError message={errors?.githubUsername?.message} />
          <Input
            ref={register({
              required: 'Githubusername is required.',
            })}
            onChange={clearError}
            name="githubUsername"
            type="text"
            placeholder="Github Username"
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
            onChange={clearError}
            name="password"
            type="password"
            placeholder="Password"
          />
          <Button
            type="submit"
            value={loading ? 'Loading...' : 'Create Account'}
            disabled={!formState.isValid || loading}
          />
        </form>
      </FormBox>
      <BottomBox cta="Have an account?" linkText="Log in" link={routes.login} />
    </AuthLayout>
  );
}
export default SignUp;
