# bottari
| 항목            | 내용                                                       |
| ------------- | -------------------------------------------------------- |
| **프로젝트명**     | bottari                                                |
| **설명**        | 짐 이동, 보관 서비스 제공 사이트 웹앱                             |
| **핵심 기능**     | 회원가입/로그인(JWT), 소셜 로그인, 권한(Role) 기반 접근, 사진 업로드, PWA 푸시 알림 |
| **사용 기술**     | Vite + React 19 (프론트) / Express 5 (백엔드) / MySQL 8.4 (DB) |
| **추가 기능(선택)** | 모바일 카메라 업로드, 지문 인증(WebAuthn)                             |

<br>
<br>

# 프로젝트 구조
```
bottari/
├── client/             # Vite + React (PWA)
│   ├── src/                # React 실행 관련 로직
│   │   ├── assets/             # 비공개 정적 파일
│   │   ├── config/             # 설정 파일 (환경 변수, API 엔드포인트, Firebase/Web Push 설정 등)
│   │   ├── components/         # 컴포넌트
│   │   ├── routes/             # React 라우터
│   │   ├── store/              # 리덕스 관련
│   │   │   ├── slices/            # 리덕스 슬라이스 관련
│   │   │   └── store.js
│   │   ├── utils/              # 유틸
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── sw.js               # service-worker 파일
│   ├── index.html
│   └── vite.config.js
│
├── server/             # Express
│   ├── app/                # Express 실행 관련 로직
│   │   ├── controllers/        # 컨트롤러 레이어 (유효성 검사 & Request·Response 시 데이터 가공 처리 & 비지니스 로직으로의 연결)
│   │   ├── middlewares/        # 미들웨어 (JWT 인증, 권한 체크, 에러 핸들링, 로깅 등)
│   │   ├── models/             # 모델 (Sequelize 등 모델)
│   │   ├── repositories/       # DB 접근 레이어
│   │   ├── services/           # 비즈니스 로직 레이어
│   │   └── utils/              # 유틸
│   ├── configs/                # 전역 설정 파일 (DB, JWT, OAuth, Push 등)
│   ├── database/           # 데이터베이스 관련
│   │   ├── migrations/         # 마이그레이션 (DB 스키마 작성 파일 등)
│   │   └── seeders/            # 시더 (DB 더미 데이터 생성 파일 등)
│   ├── routes/             # API 엔드포인트 정의
│   ├── storage/            # 정적 파일을 서빙 디렉토리 (업로드 파일, PWA build 결과물 저장소), 주의: 운영환경은 경로 다름
│   ├── app.js              # API 엔트리 포인트
│   └── .env                # 환경 변수 설정 파일
└── README.md
```

<br>
<br>

# 설치 라이브러리

### client
```
npm create vite@latest .
npm i dayjs react-router-dom @reduxjs/toolkit react-redux axios jwt-decode lucide-react motion
npm install -D vite-plugin-pwa
```
| library           |                                              |                         |
|-------------------|----------------------------------------------|-------------------------|
| react-router-dom  | React 라우팅 라이브러리 | 
| react-redux       | React에서 Redux 사용을 위한 라이브러리 |
| @reduxjs/toolkit  | Redux 상태 관리 라이브러리 |
| axios             | HTTP 클라이언트 라이브러리 |
| jwt-decode        | 브라우저 payload 데이터를 쉽게 받아오는 라이브러리 |
| vite-plugin-pwa   | PWA 기능 구현을 위한 Vite 플러그인 |
|                   | 
| dayjs             | 날짜 연산 및 포맷 라이브러리 | https://www.npmjs.com/package/dayjs |           
| lucide-react      | Feather 기반 아이콘 라이브러리 | https://socket.dev/npm/package/lucide-react |
|                   |                              | https://lucide.dev/icons/|
| motion            | 애니메이션 라이브러리 | https://motion.dev/  |
| react-datepicker  | 달력 라이브러리  | https://www.npmjs.com/package/react-datepicker |
<br>

### server
```
npm init
npm i express express-validator morgan winston dotenv sequelize sequelize-cli mysql2 cookie-parser jsonwebtoken cors multer swagger-ui-express yaml dayjs bcrypt web-push swagger-parser @faker-js/faker
npm install -D nodemon
```
| library            |                                             |                            |
|--------------------|---------------------------------------------|----------------------------|
| express            | 프레임워크 |
| express-validator  | express에서 사용하는 유효성 검사 라이브러리 |
| dotenv             | 환경 설정 파일을 적용하는 라이브러리 (.env) |
| cross-env          | Windows/Mac 상관없이 환경변수 설정 | https://www.npmjs.com/package/cross-env |
| mysql2             | node.js 환경에서 mysql을 사용할 수 있게 해주는 라이브러리 (mysql❌) |
| sequelize          | node.js 환경에서 사용하는 ORM |
| sequelize-cli      | sequelize를 cli로 사용할 수 있게 해주는 라이브러리 |
| nodemon            | 개발 단계에 서버 자동 새로고침을 도와주는 라이브러리 |
| @faker-js/faker    | 더미데이터 생성을 도와주는 라이브러리 |
|                    |
| dayjs              | 날짜 연산 및 포맷 라이브러리 |
| bcrypt             | node.js 환경에서 사용하는 단방향 암호화 라이브러리 |
| winston            | node.js 환경에서 사용하는 로깅 라이브러리 |
| cookie-parser      | cookie 를 파싱해주는 라이브러리 |
| jsonwebtoken       | JWT 생성 및 검증, payload 획득 등 라이브러리 |
|                    |
| web-push           | 웹 푸시 기능 구현을 위한 라이브러리 |
| cors               | cors 세팅을 도와주는 라이브러리 | https://www.npmjs.com/package/cors  |
| multer             | 파일을 업로드 할 수 있도록 도와주는 라이브러리 |
|                    |
| swagger-ui-express | api 명세서 작성 라이브러리 |
| swagger-parser     | yaml 번들링 라이브러리 |
|                    |
| 보류                |
| morgan             | node.js 환경에서 사용하는 http 로깅 라이브러리 nginx로 대체할 수도 있음 |
<br>



# DB 테이블 설계안
### users (회원 정보)
