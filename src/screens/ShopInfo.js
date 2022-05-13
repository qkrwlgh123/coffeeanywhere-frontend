import { gql, useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { TOKEN } from '../apollo';
import PageTitle from '../components/PageTitle';
import InfoLayout from '../components/shop/InfoLayout';
import MapScript from '../components/shop/MapScript';
import routes from '../routes';
import { DescribeInput } from './CreateShop';

const { kakao } = window;

const InfoBox = styled.div`
  margin-top: 5%;
  width: 80%;
  padding: 15px;
  background-color: #ffffff;
  justify-content: none;
`;

const TitleBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
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
  font-size: 18px;
  width: 33%;
`;

const Buttons = styled.div`
  display: flex;
  width: 33%;
  justify-content: flex-end;
  align-items: center;
  font-size: 18px;
  visibility: ${(props) => (props.isMe ? 'visible' : 'hidden')};
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

const InfoContainer = styled.div`
  display: flex;
  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

const MapContainer = styled.div`
  margin-top: 35px;
  width: 40%;
  height: 40vh;
  border-radius: 15px;
  @media (max-width: 800px) {
    width: 100%;
    height: 50vh;
  }
`;

const TextsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const HashtagBox = styled.div`
  margin-top: 35px;
  margin-left: 10px;
  display: flex;
  div {
    border-radius: 5px;
    padding: 10px;
    font-weight: 600;
    font-size: 16px;
    margin-right: 10px;
    background-color: #e5e7eb;
  }
  span {
    width: 100%;
    text-align: center;
    font-size: 17px;
  }
`;

const DescriptionBox = styled.div`
  margin-top: 35px;
  font-size: 18px;
  font-weight: 500;
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

const Line = styled.div`
  border-top: 1px solid rgb(229, 231, 235);
  margin-top: 15px;
  margin-bottom: -25px;
  color: rgb(75, 88, 99);
  font-weight: 500;
  font-size: 17px;
`;

const ReplyInputBox = styled.div`
  margin-top: 35px;
  font-size: 18px;
  font-weight: 500;
  display: flex;
  flex-direction: column;
`;

const ReplyInput = styled.input`
  width: 90%;
  height: 80px;
  margin-top: 20px;
  border-radius: 10px;
  padding: 10px;
  background-color: #fafafa;
  border: 0.5px solid rgb(219, 219, 219);
  box-sizing: border-box;
  font-size: 18px;
  opacity: ${(props) => (props.disabled ? 0.4 : 1)};
  &::placeholder {
    font-size: 18px;
  }
  :focus {
    border: 3px solid rgb(219, 219, 219);
  }
`;

const ReplyBtn = styled.input`
  cursor: pointer;
  font-weight: 400;
  text-align: center;
  width: 5%;
  padding: 10px 8px;
  margin: 15px 0px;
  font-size: 18px;
  border-radius: 8px;
  color: ${(props) =>
    props.disabled ? 'rgb(75, 85, 99)' : 'rgb(229, 231, 235)'};
  background-color: ${(props) =>
    props.disabled ? 'rgb(209, 213, 219)' : props.theme.accent};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const CommentsLength = styled.span`
  display: block;
  font-size: 17px;
  font-weight: 520;
  margin: 30px 0px;
`;

const EmptyPhotoBox = styled.div`
  width: 200%;
  text-align: center;
  font-size: 17px;
`;

const PhotoBox = styled.div`
  width: 90%;
  height: 30vh;
  padding: 12px;
`;

const Photoimg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 15px;
`;

const ReplyBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px 20px;
`;

const Reply = styled.div`
  display: flex;
  flex-direction: column;
`;

const ReplyOwner = styled.span`
  font-size: 14px;
  font-weight: 600;
`;

const ReplyContent = styled.div`
  font-size: 18px;
  padding: 25px 0px 40px 0px;
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
        user {
          id
          username
        }
        photos {
          url
        }
        categories {
          name
        }
        replys {
          content
          user {
            username
          }
          createdAt
        }
      }
    }
  }
`;

const DELETE_SHOP = gql`
  mutation deleteShop($id: Int!) {
    deleteShop(id: $id) {
      ok
      error
    }
  }
`;

const ADD_REPLY = gql`
  mutation addReply($id: Int, $content: String) {
    addReply(id: $id, content: $content) {
      ok
      error
    }
  }
`;

function ShopInfo() {
  const userName = localStorage.getItem('name');
  const [reply, setReply] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMe, setIsMe] = useState(null);
  const [message, setMessage] = useState('');
  const [list, setList] = useState([]);
  const [address, setAddress] = useState([]);
  const [description, setDescription] = useState('한줄평을 추가하세요');
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [replyList, setReplyList] = useState([]);

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
        setReplyList(data.seeCoffeeShop.shop.replys);
        setDescription(data.seeCoffeeShop.shop.description);
        searchDetailAddrFromCoords(data.seeCoffeeShop.shop, Info);
        MapScript(data.seeCoffeeShop.shop);
        setIsMe(data?.seeCoffeeShop.shop.user.username === userName);
      }
    },
  });

  const [deleteShop, { loading }] = useMutation(DELETE_SHOP, {
    onCompleted: () => {
      setMessage('삭제되었습니다.');
      setTimeout(() => navigate(routes.home, { replace: true }), 1000);
    },
  });

  const [addReply] = useMutation(ADD_REPLY, {
    context: {
      headers: {
        token: localStorage.getItem(TOKEN),
      },
    },
    onCompleted: () => {
      setReply('');
      refetch();
    },
  });

  const handleDeleteShop = () => {
    if (loading) {
      return;
    }
    deleteShop({
      variables: {
        id: Number(id),
      },
    });
  };

  const handleReply = (event) => {
    setReply(event.target.value);
  };

  const submitReply = () => {
    addReply({
      variables: {
        id: Number(id),
        content: reply,
      },
    });
  };
  // 주소-좌표 변환 객체를 생성
  const geocoder = new kakao.maps.services.Geocoder();

  function searchDetailAddrFromCoords(coords, callback) {
    // 좌표로 법정동 상세 주소 정보를 요청합니다
    geocoder.coord2Address(coords.longitude, coords.latitude, callback);
  }
  //  좌표에 대한 주소정보를 표출하는 함수
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
            <Buttons isMe={isMe}>
              <Link to={`/shop/${id}`} reloadDocument>
                <span disabled={message !== ''}>편집</span>
              </Link>
              <span onClick={handleDeleteShop} disabled={message !== ''}>
                삭제
              </span>
            </Buttons>
          </TitleBox>
          <InfoContainer>
            <MapContainer id="myMap"></MapContainer>
            <TextsContainer>
              <HashtagBox>
                {categories.length !== 0 ? (
                  categories.map((item) => (
                    <div key={item.name}>{item.name}</div>
                  ))
                ) : (
                  <span>작성된 해쉬태그가 없습니다</span>
                )}
              </HashtagBox>
              <DescriptionBox>{description}</DescriptionBox>
            </TextsContainer>
          </InfoContainer>
          <PhotoList>
            {photos.length > 0 ? (
              photos.map((item) => (
                <PhotoBox key={item.url}>
                  <Photoimg key={item.url} src={item.url} />
                </PhotoBox>
              ))
            ) : (
              <EmptyPhotoBox>
                <span>첨부된 사진이 없습니다</span>
              </EmptyPhotoBox>
            )}
          </PhotoList>
          <Line></Line>
          <ReplyInputBox>
            <ReplyInput
              placeholder="댓글 작성"
              value={reply}
              onChange={handleReply}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  if (reply.length > 1) {
                    submitReply();
                  }
                }
              }}
            />
            <ReplyBtn
              disabled={reply.length < 2}
              onClick={submitReply}
              value="등록"
            />
          </ReplyInputBox>
          <CommentsLength>댓글 {replyList?.length}</CommentsLength>
          <ReplyBox>
            {replyList?.length > 0 ? (
              replyList.map((item) => (
                <Reply>
                  <ReplyOwner>{item.user.username}</ReplyOwner>
                  <ReplyContent>{item.content}</ReplyContent>
                </Reply>
              ))
            ) : (
              <span>댓글이 없습니다</span>
            )}
          </ReplyBox>
        </InfoBox>
      ) : (
        <Message>{message}</Message>
      )}
    </InfoLayout>
  );
}
export default ShopInfo;
