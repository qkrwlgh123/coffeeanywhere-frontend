import { gql, useMutation, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { TOKEN } from '../apollo';
import Button from '../components/auth/Button';
import FormBox from '../components/auth/FormBox';
import Input from '../components/auth/input';
import Notification from '../components/auth/Notification';
import { BaseBox, Title } from '../components/shared';
import HomeLayout from '../components/shop/HomeLayout';
import routes from '../routes';
import { DescribeInput } from './CreateShop';
import { HomeBox } from './Home';

// < Send a caption to back-end >

// < Send a file to back-end >

const SubmitBtn = styled(Button)`
  width: 80px;
  border-radius: 5px;
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
          url
        }
      }
    }
  }
`;

const EDIT_SHOP_MUTATION = gql`
  mutation editCoffeeShop($id: Int!, $file: Upload, $caption: String) {
    editCoffeeShop(id: $id, file: $file, caption: $caption) {
      ok
      error
    }
  }
`;

function EditShop() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const { register, handleSubmit } = useForm();
  const [list, setList] = useState([]);
  const { id } = useParams();

  const { data } = useQuery(SHOP_QUERY, {
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
      }
    },
  });

  const [editCoffeeShop, { loading }] = useMutation(EDIT_SHOP_MUTATION, {
    onCompleted: () => {
      console.log('Success!');
      setMessage(
        'Successfully edited!. After a while, you will go to list page.'
      );
      setTimeout(() => navigate(routes.home), 1000);
    },
  });

  const onSubmitValid = (data) => {
    if (loading) {
      return;
    }
    const { file } = data;
    editCoffeeShop({
      variables: {
        id: Number(id),
        ...data,
        file: file[0],
      },
      context: {
        headers: {
          token: localStorage.getItem(TOKEN),
        },
      },
    });
  };
  return (
    <HomeLayout>
      <FormBox>
        <Title>{list?.name}</Title>
        <Notification message={message} />
        {message === '' ? (
          <form onSubmit={handleSubmit(onSubmitValid)}>
            <>Select a photo which you want to add!</>
            <Input
              ref={register}
              name="file"
              type="file"
              accept="image/*"
              placeholder="Image"
            />
            <DescribeInput
              ref={register}
              type="text"
              name="caption"
              placeholder="Modify information about a shop with Hash tag!"
            />
            <SubmitBtn
              type="submit"
              value="confirm"
              disabled={message !== ''}
            />
          </form>
        ) : null}
      </FormBox>
    </HomeLayout>
  );
}
export default EditShop;
