## ✨ Description

```
Coffee anywhere는 전국의 사용자들이 다녀왔던 카페 정보를 서로 공유하고, 관심이 가는 카페를 나만의 리스트에 저장하여
최종적으로 더 나은 카페 문화를 만들 수 있도록 도와주는 서비스입니다.
```

## 📌 Project Goal

```
현대인들에게 커피는 삶에서 뗄 수 없는 기호식품이 되었습니다.
이른 아침, 피곤한 몸을 이끌고 일정을 보내며 마시는 커피는 단물과도 같고, 가족 또는 오랜만에 만난 친구나 지인과 함께 카페에서
수다를 떨며 마시는 커피는 두 말할 필요 없는 소중한 경험입니다.
이런 경험들이 더 행복하게 기억될 수 있도록, 다른 장소가 아닌 오직 카페만의 정보를 미리 볼 수 있고, 나의 소중한 경험을
서비스 사용자들과 공유하며 더 나은 카페 문화를 만들고자 이 프로젝트를 기획하게 되었습니다.
이 서비스는 취향에 더 알맞는 커피를 판매하는 카페를 미리 알아보고, 카페에서 보내는 시간이 행복하기를 원하는
사용자들에게 유익한 서비스가 될 것입니다.
```

## 🔍 서비스 기능

| ID                     | 요구 사항           | 설명                                                                           |
| ---------------------- | ------------------- | ------------------------------------------------------------------------------ |
| 로그인, 비 로그인 공통 |
| 1                      | 소셜 로그인         | 카카오 로그인을 통한 간편 로그인 기능 구현                                     |
| 2                      | 회원 가입           | 처음 이용 시 서비스 이용에 필요한 정보 작성 및 제출 기능 구현                  |
| 3                      | 로그인/로그아웃     | 회원의 웹 사이트 이용을 위한 로그인 및 로그아웃 기능 구현                      |
| 4                      | 게시물 목록 조회    | 공개 여부가 'on'인 게시물 목록 조회 기능 구현                                  |
| 5                      | 게시물 조회         | 공개 여부가 'on'인 게시물 상세 정보 조회 기능 구현                             |
| 6                      | 프로필 조회         | 다른 사용자의 프로필 및 작성한 게시물 목록 조회 기능 구현                      |
| 로그인 시 기능         |
| 7                      | 게시물 등록         | 알고 있는 카페의 정보를 이용한 게시물 작성 및 등록 기능 구현                   |
| 8                      | 게시물 편집 및 삭제 | 작성한 게시물의 내용 편집 및 삭제 기능 구현                                    |
| 9                      | 좋아요 등록 및 해제 | 다른 사용자가 등록한 게시물 중, 관심 가는 게시물 좋아요 등록 및 해제 기능 구현 |
| 10                     | 댓글 작성           | 다른 사용자가 등록한 게시물에 댓글 작성 기능 구현                              |
| 11                     | 댓글 편집 및 삭제   | 작성한 댓글의 내용 편집 및 삭제 기능 구현                                      |
| 12                     | 관심 목록           | 좋아요를 등록한 게시물 목록 조회 기능 구현                                     |
| 13                     | 내 목록             | 작성한 게시물 목록 조회 기능 구현                                              |
| 14                     | 프로필 수정         | 사용자의 프로필 사진, 닉네임, 비밀번호, 이메일 수정 기능 구현                  |

## 🔍 Overview

### 1. 회원 가입 페이지 (Sign Up Page)

<img src="https://user-images.githubusercontent.com/85853566/175859352-d0c5ca4c-2db5-4200-bcc3-43af34a54262.png" width="800" height="500"/>
<img src="https://user-images.githubusercontent.com/85853566/175859439-c075e206-79a8-4fc3-8655-34fd48a3f443.png" width="800" height="500"/>
<br/>
웹 사이트 이용을 위한 회원 가입 기능

### 2. 유저 로그인 페이지 (User Login Page) (소셜로그인)

<img src="https://user-images.githubusercontent.com/85853566/175861186-b5e7c770-13fb-47cc-8bd8-b51b2e804159.png" width="800" height="500"/>
<br/>
<img src="https://user-images.githubusercontent.com/85853566/175861245-8277d576-31e2-4ec3-8de9-8c314770c08f.png" width="800" height="700"/>
<br/>
Kakao API를 이용한 소셜 로그인 또는 등록된 정보를 이용한 로그인

### 3. 게시물 목록 조회(Post List)

<img src="https://user-images.githubusercontent.com/85853566/176068230-9ca35c4e-b201-40e5-93ca-46dd3d73e397.gif" width="1000" height="500"/>
<br/>
Infinite Scroll을 이용한 게시물 목록 조회 기능

### 4. 게시물 상세 정보 조회 (Post Details)

<img src="https://user-images.githubusercontent.com/85853566/175863878-b0a65fff-9544-4e11-b955-0397a50142b7.gif" width="1000" height="500"/>
<img src="https://user-images.githubusercontent.com/85853566/175864275-4ae8debe-83cc-4f8d-ac76-fdb63478beb0.png" width="1000" height="700"/>
<img src="https://user-images.githubusercontent.com/85853566/175864287-1550b97d-e757-4a11-9b6e-3212ce5a2396.png" width="1000" height="500"/>
<br/>
게시물 사진 목록 Carousel 구성, Kakao 지도 API를 이용한 위치 및 댓글 확인

### 5. 사용자 프로필 조회 (See Profile)

<img src="https://user-images.githubusercontent.com/85853566/175865447-67965e02-5c72-42c0-a352-6b6a4640c4e4.gif" width="800" height="500"/>
<br/>
다른 사용자의 프로필 및 보유 게시물 조회 기능

### 6. 게시물 등록 (Post)

<img src="https://user-images.githubusercontent.com/85853566/176069949-026482f0-0487-4faf-a28e-f98c29217bf6.gif" width="800" height="500"/>
<img src="https://user-images.githubusercontent.com/85853566/176070334-0bfd0604-c291-41d1-8cd7-bbfad4837536.png" width="800" height="700"/>
<br/>
카카오 지도 API를 이용한 장소 검색어 자동 완성, 게시물 정보 작성 및 등록

### 7. 내 목록 (My List)

<img src="https://user-images.githubusercontent.com/85853566/176072333-505a03a7-4dd8-4dc6-8c6f-fc0bb33c7190.gif" width="800" height="500"/>
<br/>
등록한 게시물 목록 조회 기능

### 8. 게시물 편집 및 삭제 (Edit Post, Delete)

<img src="https://user-images.githubusercontent.com/85853566/176073350-b5af853f-171e-4eec-9295-f86d81578466.png" width="1000" height="500"/>
<img src="https://user-images.githubusercontent.com/85853566/176073380-b1691b6e-10b2-4e4a-9159-744df2f29a8a.png" width="800" height="700"/>
<br/>
등록한 게시물 정보 편집 및 삭제 기능

### 9. 좋아요 등록 (Like)

<img src="https://user-images.githubusercontent.com/85853566/176075892-06a4d053-f9e7-4cf6-8180-a0d4d29351e6.png" width="1000" height="500"/>
<img src="https://user-images.githubusercontent.com/85853566/176075909-d5a8f0f2-60ab-4567-a051-82ec98a37133.png" width="800" height="500"/>
<br/>
관심 가는 게시물 좋아요 등록, 해당 게시물 관심 목록에서 조회 기능

### 10. 댓글 (Reply)

<img src="https://user-images.githubusercontent.com/85853566/176078411-6da0d294-8948-4787-8a0b-d6795b93a8fc.png" width="1000" height="400"/>
<img src="https://user-images.githubusercontent.com/85853566/176078426-af2df24c-d8a1-40a5-b1a5-53844f5a6eae.png" width="1000" height="400"/>
<br/>
등록된 게시물에 댓글 작성, 편집 및 삭제 기능

### 11. 프로필 수정 (Edit Profile)

<img src="https://user-images.githubusercontent.com/85853566/176079477-62d34368-72fc-465a-ba68-4a0a6b424352.png" width="800" height="700"/>
<br/>
사용자 프로필 사진, 닉네임, 비밀번호, 이메일 및 소개글 수정 기능

## 🔧 Tech Stack

### Frontend <br/>

<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/apollo-311C87?style=for-the-badge&logo=apollo-graphql&logoColor=black"> <img src="https://img.shields.io/badge/styled components-DB7093?style=for-the-badge&logo=styled-components&logoColor=black">

### Backend <br/>

<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/graphql-E10098?style=for-the-badge&logo=graphql&logoColor=black"> <img src="https://img.shields.io/badge/apollo-311C87?style=for-the-badge&logo=apollo-graphql&logoColor=black"> <img src="https://img.shields.io/badge/prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=black"> <img src="https://img.shields.io/badge/aws s3-569A31?style=for-the-badge&logo=amazons3&logoColor=black"> <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=node.js&logoColor=black"> <img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white"> <img src="https://img.shields.io/badge/postgresql-4169E1?style=for-the-badge&logo=postgresql&logoColor=black">

### API <br/>

<img src="https://img.shields.io/badge/kakao-FFCD00?style=for-the-badge&logo=kakao&logoColor=black">

## 🏃 Steps to run

### Frontend

https://github.com/qkrwlgh123/coffeeanywhere-frontend

```
$ npm install
$ npm start
```

### Backend

https://github.com/qkrwlgh123/coffeeanywhere-backend

```
$ npm install
$ npm run dev
```

## 📝 Author & License

박지호 – jiho1024@naver.com

이 프로젝트는 MIT 라이센스를 준수합니다.

This project is licensed under the terms of the MIT license.
