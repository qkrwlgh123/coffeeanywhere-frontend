import Button from '../components/auth/Button';
import FormBox from '../components/auth/FormBox';
import styled from 'styled-components';
import { ErrorBox, Title } from '../components/shared';
import PageTitle from '../components/PageTitle';
import { useForm } from 'react-hook-form';
import FormError from '../components/auth/FormError';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { FileUpload, UploadBox } from './CreateShop';
import ProfileInfoLayout from '../components/shop/ProfileInfoLayout';
import { SearchInput } from './PublicList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { TOKEN } from '../apollo';

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

const INFO_QUERY = gql`
  query seeMyProfile {
    seeMyProfile {
      ok
      error
      user {
        username
        avatar
        description
        email
        isKaKao
      }
    }
  }
`;

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile(
    $username: String
    $email: String
    $description: String
    $password: String
    $avatar: Upload
  ) {
    editProfile(
      username: $username
      description: $description
      email: $email
      password: $password
      avatar: $avatar
    ) {
      ok
      error
    }
  }
`;

function EditProfile() {
  const [oldName, setOldName] = useState('');
  const [oldEmail, setOldEmail] = useState('');
  const [oldDesc, setOldDesc] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [prevAvatar, setPrevAvatar] = useState('');
  const [uploadAvatar, setUploadAvatar] = useState('');

  const { register, handleSubmit, errors, formState, setError, clearErrors } =
    useForm({
      mode: 'onChange',
    });

  const { data, refetch } = useQuery(INFO_QUERY, {
    context: {
      headers: {
        token: localStorage.getItem(TOKEN),
      },
    },
    onCompleted: () => {
      setPrevAvatar(data?.seeMyProfile.user.avatar);
      setOldName(data?.seeMyProfile.user.username);
      setOldEmail(data?.seeMyProfile.user.email);
      setOldDesc(data?.seeMyProfile.user.description);
    },
    fetchPolicy: 'no-cache',
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
      editProfile: { ok, error },
    } = data;
    if (!ok) {
      setError('result', {
        message: error,
      });
      setErrorMessage('?????? ????????? ?????? ????????? ????????? ?????? ???????????????.');
    } else {
      refetch();
      setErrorMessage('???????????? ?????????????????????.');
    }
  };

  const [editProfile, { loading }] = useMutation(EDIT_PROFILE_MUTATION, {
    context: {
      headers: {
        token: localStorage.getItem(TOKEN),
      },
    },
    onCompleted,
  });

  const onSubmitValid = (data) => {
    if (loading) {
      return true;
    }

    editProfile({
      variables: {
        username: data.username !== oldName ? data.username : undefined,
        email: data.email !== oldEmail ? data.email : undefined,
        description:
          data.description !== oldDesc ? data.description : undefined,
        password: data.password,
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
      <PageTitle title="????????? ??????" />
      <FormBox>
        <HeaderContainer>
          <Title>????????? ??????</Title>
        </HeaderContainer>

        <form onSubmit={handleSubmit(onSubmitValid)}>
          <UploadBox>
            {prevAvatar || uploadAvatar ? (
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
              minLength: {
                value: 2,
                message: '??????????????? ??? ?????? ?????? ????????? ???????????????.',
              },
            })}
            name="username"
            type="text"
            placeholder="????????? ??????"
            defaultValue={data?.seeMyProfile.user.username}
            onChange={clearError}
          />
          <FormError message={errors?.username?.message} />
          <InputDescribeBox>
            Cafe anywhere?????? ????????? ???????????????.
          </InputDescribeBox>
          <AuthInput
            ref={register({
              minLength: {
                value: 5,
                message: '??????????????? ?????? ?????? ?????? ????????? ???????????????.',
              },
            })}
            name="password"
            type="password"
            placeholder="???????????? ??????"
            onChange={clearError}
          />
          <FormError message={errors?.password?.message} />
          <AuthInput
            ref={register}
            name="email"
            type="text"
            placeholder="?????????"
            defaultValue={data?.seeMyProfile.user.email}
            onChange={clearError}
          />
          <FormError message={errors?.email?.message} />
          <AuthInput
            ref={register}
            name="description"
            type="text"
            placeholder="?????????"
            defaultValue={data?.seeMyProfile.user.description}
            onChange={clearError}
          />
          <InputDescribeBox>
            ???????????? ????????? ????????? ??????????????????.
          </InputDescribeBox>
          <ErrorBox active={errorMessage !== ''}>
            {errorMessage !== '' ? errorMessage : null}
          </ErrorBox>
          <Button
            type="submit"
            value={loading ? 'Loading...' : '????????? ??????'}
            disabled={!formState.isValid || loading}
          />
        </form>
      </FormBox>
    </ProfileInfoLayout>
  );
}
export default EditProfile;
