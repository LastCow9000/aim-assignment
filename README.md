# AIM-Assignment

## 개발 환경

- Nodejs@20.1.0
- Nestjs@10.0
- Mysql@8.0
- TypeOrm
- Docker

## 구동 방법

1. 아래의 명령어를 쉘에 입력합니다.

   ```bash
   $ git clone https://github.com/LastCow9000/aim-assignment.git
   ```

2. .env 파일을 생성하여 아래의 내용을 넣습니다.
   - PORT 와 SALT는 수정 불가하며 나머지 값들은 임의대로 넣으셔도 됩니다.
   ```txt
   PORT=3000
   MYSQL_DATABASE=aim
   MYSQL_USER=aim
   MYSQL_PASSWORD=112233
   MYSQL_ROOT_PASSWORD=112233
   SALT=10
   JWT_SECRET=ItIsSecret
   ```
3. Docker를 사용하여 서버를 실행합니다.
   ```bash
   $ docker compose up --build -d
   ```
4. postman류의 도구로 Api를 테스트합니다.

   - baseEndpoint : http://localhost:3003

   - 인증이 필요한 api는 login 후 반환되는 accessToken을 Header에 Bearer 토큰으로 넣어야 합니다.

## 진행 내용

- 유저는 원화 계좌, 달러 계좌 각각 한 개씩의 계좌만 가질 수 있도록 했습니다.
- 유저는 여러 개의 포트폴리오를 가질 수 있도록 했습니다.
- 회원가입 시 기본적으로 원화 계좌를 생성하도록 했습니다.
- 로그인은 JWT를 이용하여 구현했습니다.
  - 실제 서비스를 위해서는 보안 상 refreshToken도 이용해야 하지만 이번 과제에서는 편의성을 위해 AccessToken만 구현했습니다.
  - AccessToken은 Authrozation 헤더에 Bearer ${accessToken} 으로 발급되고 Cookie에도 자동으로 담겨져서 발급되며 Cookie의 이름은 access_token 입니다.
  - AccessToken은 10분간 유효합니다.
  - access_history 테이블에 로그인/로그아웃 이력이 기록됩니다.
- 입출금 api는 type('deposit' or 'withdrawal')을 통해 입출금을 구분하여 처리하도록 했습니다.
  - account_histoy 테이블에 입/출금 내역이 기록됩니다.
  - 입출금 내역에 상세 정보 컬럼을 추가하여 유저가 입출금을 했는 지 혹은 자문 요청으로 인해 출금이 되었는 지 정보를 넣도록 했습니다.
- 서버 실행 시 10개의 증권 더미 데이터를 넣도록 했습니다.
- 편의성을 위해 증권 목록 조회 api를 추가 구현했습니다.
- 포트폴리오 위험도 선택 api와 진행 요청 api를 분리하여 구현했습니다.
- 편의성을 위해 모든 포트폴리오 목록 조회 api를 추가 구현했습니다.
- 편의성을 위해 포트폴리오 상세정보 조회 api를 추가 구현했습니다.

## ERD

![erd](https://github.com/user-attachments/assets/3a044069-fd08-48ae-a1e5-d06bdf4f06c9)

## API Docs

<details>
<summary>접기/펼치기</summary>

### 회원가입

- POST /api/v1/users
- Body
  - userId: 회원 아이디
  - password: 비밀번호
  - name: 이름
  - ex) {userId: "testUser", password:"1234", name:"Tim"}

#### Reponse

##### status code: 201

##### Body:

```json
  {
      "success": 성공 여부,
      "data": {
          "id": User PK
      }
  }
```

##### 응답 예시:

```json
{
  "success": true,
  "data": {
    "id": 2
  }
}
```

<br/>

### 로그인

- GET /api/v1/users/login
- Body
  - userId: 회원 아이디
  - password: 비밀번호
  - ex) {userId: "testUser", password:"1234"}

#### Response

##### status code: 201

##### Header:

```http
Authorization: Bearer ${Access Token}
Set-Cookie: access_token=${Access Token}; HttpOnly;
```

##### Body:

```json
{
    "success": 성공 여부,
    "data": {
        "accessToken": Access Token
    }
}
```

##### 응답 예시:

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcklkIjoiZGlkZGlkdGpzdGpzIiwibmFtZSI6IlNZUyIsImlhdCI6MTczNDY0NTYxMywiZXhwIjoxNzM0NjQ2MjEzfQ.d0G-s266_46Wt5nPGQo3pBftGyiEvE6NnnJwZUTtpZM"
  }
}
```

<br/>

### 잔고 조회 (인증된 유저만 사용 가능)

- GET /api/v1/accounts/:account_type
- Parameters
  - account_type: 계좌 타입
    - enum: ['krw', 'usd']
  - ex) /accounts/krw

#### Reponse

##### status code: 200

##### Body:

```json
{
  "success": 성공 여부,
  "data": {
    "amount": 잔고
  }
}
```

##### 응답 예시:

```json
{
  "success": true,
  "data": {
    "amount": 10000
  }
}
```

<br/>

### 입출금 (인증된 유저만 사용 가능)

- PATCH /api/v1/accounts
- Body
  - accountType: 계좌 타입
    - enum: ['krw', 'usd']
  - transactionType: 거래 종류
    - enum: ['deposit', 'withdrawal']
  - amount: 거래 금액
  - ex) {"accountType": "krw", "transactionType": "deposit", "amount": 3000000}

#### Reponse

##### status code: 200

##### Body:

```json
{
    "success": 성공 여부
}
```

##### 응답 예시:

```json
{
  "success": true
}
```

<br/>

### 증권 등록

- POST /api/v1/stocks
- Body
  - code: 증권 코드
  - name: 증권명
  - price: 증권 가격
  - ex) {"code": "SOXL", "name": "반도체 3배 레버리지", "price": 300000}

#### Reponse

##### status code: 201

##### Body:

```json
{
    "success": 성공 여부,
    "data": {
        "id": 증권 PK
    }
}
```

##### 응답 예시:

```json
{
  "success": true,
  "data": {
    "id": 12
  }
}
```

<br/>

### 증권 목록 조회

- GET /api/v1/stocks

#### Reponse

##### status code: 200

##### Body:

```json
{
    "success": 성공 여부,
    "data": Array<{
        "id": 증권 PK,
        "createdAt": 생성 날짜,
        "updatedAt": 수정 날짜,
        "code": 증권 코드,
        "name": 증권명,
        "price": 증권 가격
      }>
}
```

##### 응답 예시:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "createdAt": "2024-12-19T18:34:27.615Z",
      "updatedAt": "2024-12-19T18:34:27.615Z",
      "code": "sa123",
      "name": "삼성전자",
      "price": 90000
    },
    {
      "id": 2,
      "createdAt": "2024-12-19T18:34:27.621Z",
      "updatedAt": "2024-12-19T18:34:27.621Z",
      "code": "sk456",
      "name": "SK하이닉스",
      "price": 200000
    }
  ]
}
```

### 증권 가격 수정

- PATCH /api/v1/stocks/:stock_code
- Parameters
  - stock_code: 증권코드
  - ex) /stocks/tsla
- Body
  - price: 수정 가격
  - ex) { "price": 3400 }

#### Reponse

##### status code: 200

##### Body:

```json
{
    "success": 성공 여부
}
```

##### 응답 예시:

```json
{
  "success": true
}
```

<br/>

### 증권 삭제

- DELETE /api/v1/stocks/:stock_code
- Parameters
  - stock_code: 증권코드
  - ex) /stocks/tsla

#### Reponse

##### status code: 200

##### Body:

```json
{
    "success": 성공 여부
}
```

##### 응답 예시:

```json
{
  "success": true
}
```

<br/>

### 포트폴리오 위험도 선택 (인증된 유저만 사용 가능)

- POST /api/v1/portfolios
- Body
  - riskType: 위험도
    - enum: ['aggressive', 'moderate']
  - ex) { "riskType": "aggressive" }

#### Reponse

##### status code: 201

##### Body:

```json
{
    "success": 성공 여부,
    "data": {
        "id": 포트폴리오 PK
    }
}
```

##### 응답 예시:

```json
{
  "success": true,
  "data": {
    "id": 3
  }
}
```

<br/>

### 자문 진행 요청 (인증된 유저만 사용 가능)

- POST /api/v1/portfolios/:portfolio_id/execute
- Parameters
  - portfolio_id: 포트폴리오 PK
  - ex) /portfolios/7/execute

#### Reponse

##### status code: 201

##### Body:

```json
{
    "success": 성공 여부
}
```

##### 응답 예시:

```json
{
  "success": true
}
```

### 모든 포트폴리오 리스트 조회 (인증된 유저만 사용 가능)

- GET /api/v1/portfolios

#### Reponse

##### status code: 200

##### Body:

```json
{
  "success": true,
  "data": Array<{
      "id": 포트폴리오 PK,
      "createdAt": 생성 날짜,
      "updatedAt": 수정 날짜,
      "riskType": 위험도,
      "isProgressed": 자문 요청 진행 여부
  }>
}
```

##### 응답 예시:

```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "createdAt": "2024-12-20T04:06:21.175Z",
      "updatedAt": "2024-12-20T04:06:45.000Z",
      "riskType": "aggressive",
      "isProgressed": true
    },
    {
      "id": 3,
      "createdAt": "2024-12-20T04:06:23.177Z",
      "updatedAt": "2024-12-20T04:07:48.000Z",
      "riskType": "aggressive",
      "isProgressed": true
    }
  ]
}
```

<br/>

### 포트폴리오 상세 정보 조회 (인증된 유저만 사용 가능)

- GET /api/v1/portfolios/:portfolio_id
- Parameters
  - portfolio_id: 포트폴리오 PK
  - ex) /portfolios/6

#### Reponse

##### status code: 200

##### Body:

```json
{
  "success": 성공 여부,
  "data": Array<{
      "code": 증권 코드,
      "name": 증권명,
      "quantity": 보유 수량,
      "purchasePrice": 1주당 구입 가격,
      "purchaseDate": 구매 날짜
  }>
}
```

##### 응답 예시:

```json
{
  "success": true,
  "data": [
    {
      "code": "hd123",
      "name": "HD현대일렉트릭",
      "quantity": 3,
      "purchasePrice": 390000,
      "purchaseDate": "2024-12-20T07:47:11.131Z"
    },
    {
      "code": "lg123",
      "name": "LG에너지솔루션",
      "quantity": 1,
      "purchasePrice": 300000,
      "purchaseDate": "2024-12-20T07:47:11.140Z"
    }
  ]
}
```

  </details>
