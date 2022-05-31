import { gql, useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons'; // ♡
import {
  faHeart as solidHeart,
  faDeleteLeft,
  faAngleLeft,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons'; // ♥︎
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { isLoggedInvar, TOKEN } from '../apollo';
import Avatar from '../components/auth/Avatar';
import PageTitle from '../components/PageTitle';
import InfoLayout from '../components/shop/InfoLayout';
import MapScript from '../components/shop/MapScript';
import routes from '../routes';

const InfoBox = styled.div`
  margin-top: 5%;
  width: 80%;
  padding: 15px;
  background-color: #ffffff;
  justify-content: none;
`;

const HeaderBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  svg {
    width: 48px;
    height: 48px;
    cursor: pointer;
  }
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

const LikeBox = styled.div`
  display: flex;
  align-items: center;
  span {
    font-size: 30px;
    margin-left: 8px;
    color: #1f2937;
  }
`;

const Like = styled.div`
  display: flex;
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
  background-color: #9ba3af;
  border-radius: 9999px;
  cursor: pointer;
  span {
    -ms-user-select: none;
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    user-select: none;
  }
  svg {
    width: 28px;
    height: 28px;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const NameBox = styled.div`
  width: 100%;
  font-size: 48px;
  margin-top: 48px;
  font-weight: 500;
  color: #1f2937;
`;

const Ownerbox = styled.div`
  margin-top: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Owner = styled.div`
  display: flex;
  align-items: center;
`;

const OwnerName = styled.span`
  font-size: 24px;
  margin-left: 8px;
  color: #1f2937;
`;

const Date = styled.span`
  font-size: 24px;
  color: #64748b;
`;

const MapContainer = styled.div`
  margin-top: 35px;
  width: 40%;
  height: 30vh;
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

export const HashtagBox = styled.div`
  display: flex;
  margin-top: 48px;
  padding-bottom: 32px;
  border-bottom: 2px solid rgb(229, 231, 235);
  div {
    background-color: #64748b;
    padding: 8px 12px;
    margin: 4px 0px 4px 8px;
    border-radius: 12px;
    font-size: 16px;
    color: #ffffff;
  }
  span {
    width: 100%;
    text-align: center;
    font-size: 17px;
    background-color: #64748b;
  }
`;

const DescriptionBox = styled.div`
  font-size: 20px;
  font-weight: 400;
  margin: 50px 0px;
`;

const PhotoList = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 500px;
  margin: 30px 0px;
`;

const ReplyInputBox = styled.div`
  margin-top: 4px;
  font-size: 18px;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const ReplyInput = styled.input`
  width: 100%;
  height: 100px;
  margin-top: 20px;
  border-radius: 10px;
  padding: 8px 12px;
  background-color: #fafafa;
  background-color: #ffffff;
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
  width: 10%;
  padding: 10px 8px;
  margin: 16px 0px;
  font-size: 18px;
  border-radius: 8px;
  color: ${(props) =>
    props.disabled ? 'rgb(75, 85, 99)' : 'rgb(229, 231, 235)'};
  background-color: ${(props) =>
    props.disabled ? 'rgb(209, 213, 219)' : '#475569'};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const CommentsLength = styled.span`
  display: block;
  font-size: 24px;
  color: #1f2937;
  margin-top: 48px;
`;

const PhotoBox = styled.div`
  width: 860px;
  height: 500px;
`;

const PhotoSelectedBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  svg {
    cursor: pointer;
    color: rgb(33, 37, 41);
    width: 15px;
    height: 26px;
  }
`;

const Photoimg = styled.img`
  border-radius: 8px;
  width: 800px;
  height: 500px;
  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  margin: 0px 12px;
`;

const PhotoCircleBox = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px 0px;
  margin-top: -40px;
`;

const PhotoCircle = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? '#FFFFFF' : '#848384')};
  margin: 0px 4px;
  cursor: pointer;
`;

const ReplyBox = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 0px;
`;

const Reply = styled.div`
  width: 100%;
  padding: 12px;
  background-color: rgb(249, 250, 251);
  border-radius: 12px;
  margin-bottom: 10px;
`;

const ReplyInfo = styled.div`
  display: flex;
  align-items: center;
`;

const InfoText = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
`;

const ReplyOwner = styled.span`
  font-size: 18px;
`;

const ReplyDate = styled.div`
  font-size: 14px;
  color: #9ca3af;
  margin-top: 5px;
`;

const ReplyContent = styled.div`
  font-size: 16px;

  margin: 24px 36px;
`;

export const Message = styled.span`
  position: absolute;
  top: 45%;
  left: 43%;
  font-weight: 400;
  font-size: 20px;
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
        address
        user {
          id
          username
          avatar
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
            avatar
          }
        }

        likes {
          like
        }
        isLike
        createdAt
        updatedAt
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

const ADD_LIKE = gql`
  mutation addLike($id: Int, $like: Boolean) {
    addLike(id: $id, like: $like) {
      ok
      error
    }
  }
`;

const DELETE_LIKE = gql`
  mutation deleteLike($id: Int) {
    deleteLike(id: $id) {
      ok
      error
    }
  }
`;

function ShopInfo() {
  const isLogged = useReactiveVar(isLoggedInvar);
  const userName = localStorage.getItem('name');
  const [isLike, setIsLike] = useState(null);
  const [likeMessage, setLikeMessage] = useState('');
  const [reply, setReply] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMe, setIsMe] = useState(null);
  const [message, setMessage] = useState('');
  const [photoIndex, setPhotoIndex] = useState(0);

  const handlePhotoLeft = () => {
    if (photoIndex !== 0) {
      setPhotoIndex((current) => current - 1);
    }
  };

  const handlePhotoRight = () => {
    if (photoIndex !== data?.seeCoffeeShop.shop.photos.length - 1) {
      setPhotoIndex((current) => current + 1);
    }
  };

  const { data, loading, refetch } = useQuery(SHOP_QUERY, {
    variables: {
      id: Number(id),
    },
    context: {
      headers: {
        token: localStorage.getItem(TOKEN),
      },
    },
    onCompleted: () => {
      setIsMe(data?.seeCoffeeShop?.shop?.user?.username === userName);
      setIsLike(data?.seeCoffeeShop?.shop?.isLike);
      MapScript(data?.seeCoffeeShop.shop);
    },
    fetchPolicy: 'no-cache',
  });

  const [addLike] = useMutation(ADD_LIKE, {
    onCompleted: () => refetch(),
    context: {
      headers: {
        token: localStorage.getItem(TOKEN),
      },
    },
  });

  const [deleteLike] = useMutation(DELETE_LIKE, {
    onCompleted: () => refetch(),
    context: {
      headers: {
        token: localStorage.getItem(TOKEN),
      },
    },
  });

  const handleLike = () => {
    if (!isLogged) {
      alert('찜하려면 로그인해주세요!');
      return;
    }
    if (!isLike) {
      setIsLike(true);
      addLike({
        variables: {
          id: Number(id),
          like: true,
        },
      });
      setLikeMessage('내 관심목록에 추가되었습니다');
    } else {
      deleteLike({
        variables: {
          id: Number(id),
        },
      });
      setLikeMessage('내 관심목록에서 제외되었습니다');
    }
  };

  const [deleteShop] = useMutation(DELETE_SHOP, {
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

  return (
    <InfoLayout>
      <PageTitle title={`${data?.seeCoffeeShop?.shop?.name}`} />
      {message === '' && !loading ? (
        <InfoBox>
          <HeaderBox>
            <FontAwesomeIcon icon={faDeleteLeft} color="#1F2937" size="3x" />
            {isMe ? (
              <Buttons isMe={isMe}>
                <Link to={`/edit/${id}`} reloadDocument>
                  <span disabled={message !== ''}>편집</span>
                </Link>
                <span onClick={handleDeleteShop} disabled={message !== ''}>
                  삭제
                </span>
              </Buttons>
            ) : (
              <LikeBox>
                {likeMessage}
                <Like onClick={handleLike}>
                  {!isLike || !isLogged ? (
                    <FontAwesomeIcon icon={regularHeart} color="1F2937" />
                  ) : (
                    <FontAwesomeIcon icon={solidHeart} color="1F2937" />
                  )}
                </Like>
                <span>{data?.seeCoffeeShop.shop.likes.length}</span>
              </LikeBox>
            )}
          </HeaderBox>
          <PhotoList>
            {data?.seeCoffeeShop.shop.photos.length > 0 ? (
              <PhotoBox>
                <PhotoSelectedBox>
                  <FontAwesomeIcon
                    icon={faAngleLeft}
                    onClick={handlePhotoLeft}
                  />
                  <Photoimg
                    src={data?.seeCoffeeShop.shop.photos[photoIndex].url}
                  />
                  <FontAwesomeIcon
                    icon={faAngleRight}
                    onClick={handlePhotoRight}
                  />
                </PhotoSelectedBox>
                <PhotoCircleBox>
                  {data?.seeCoffeeShop.shop.photos.map((item, index) => (
                    <PhotoCircle
                      key={item.url}
                      active={index === photoIndex}
                    ></PhotoCircle>
                  ))}
                </PhotoCircleBox>
              </PhotoBox>
            ) : (
              <span>첨부된 사진이 없습니다.</span>
            )}
          </PhotoList>
          <InfoContainer>
            <NameBox>{data?.seeCoffeeShop?.shop.name}</NameBox>
            <Ownerbox>
              <Owner>
                <Avatar url={data?.seeCoffeeShop.shop.user.avatar} />
                <OwnerName>{data?.seeCoffeeShop.shop.user.username}</OwnerName>
              </Owner>
              <Date>
                {data?.seeCoffeeShop.shop.updatedAt
                  ? new Intl.DateTimeFormat('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    }).format(data?.seeCoffeeShop.shop.updatedAt)
                  : new Intl.DateTimeFormat('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    }).format(data?.seeCoffeeShop.shop.createdAt)}
              </Date>
            </Ownerbox>
            <MapContainer id="myMap"></MapContainer>
            <HashtagBox>
              {data?.seeCoffeeShop.shop.categories.length !== 0 ? (
                data?.seeCoffeeShop.shop.categories.map((item) => (
                  <div key={item.name}>{item.name}</div>
                ))
              ) : (
                <span>작성된 해쉬태그가 없습니다</span>
              )}
            </HashtagBox>
          </InfoContainer>
          <DescriptionBox>
            {data?.seeCoffeeShop?.shop.description}
          </DescriptionBox>
          <CommentsLength>
            {data?.seeCoffeeShop?.shop?.replys?.length} 개의 댓글이 있습니다.
          </CommentsLength>
          <ReplyInputBox>
            <ReplyInput
              placeholder={isLogged ? '' : '로그인이 필요합니다.'}
              disabled={!isLogged}
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
              disabled={reply.length < 2 || !isLogged}
              onClick={submitReply}
              value="댓글 등록"
            />
          </ReplyInputBox>

          <ReplyBox>
            {data?.seeCoffeeShop?.shop?.replys?.length > 0 ? (
              data?.seeCoffeeShop?.shop?.replys?.map((item) => (
                <Reply key={item.content}>
                  <ReplyInfo>
                    <Avatar url={item.user.avatar} />
                    <InfoText>
                      <ReplyOwner>{item.user.username}</ReplyOwner>
                      <ReplyDate>
                        {new Intl.DateTimeFormat('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        }).format(item.createdAt)}
                      </ReplyDate>
                    </InfoText>
                  </ReplyInfo>
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
