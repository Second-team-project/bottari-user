import axios from 'axios';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';

import { reissueThunk } from '../store/thunks/authThunk';

// store 저장용 변수
let store = null;

// store 주입용 함수 : Main.jsx -> axiosInstance.js
export function injectStoreInAxios(_store) {
  store = _store;
}

// axios 인스턴스 생성         ↱ axios 인스턴스 생성
const axiosIns = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,  // 기본 URL (axios 호출 시 가장 앞에 자동으로 연결하여 동작)
  headers: {
    'Content-Type': 'application/json',
  },
  // 크로스 도메인    ↱ default : false
  // 서로 다른 도메인에 요청 보낼 때, credential 정보를 담아 보낼지 여부
  // credential 정보 : 1. 쿠키, 2. 헤더 Authorization 항목
  withCredentials: true,
});

// ===== axios 요청 가로 채서, 베어로 토큰 설정 & 엑세스 토큰 만료 체크
axiosIns.interceptors.request.use(async (config) => {
  // 재시도 막을 url
  const noRetry = /^\/api\/user\/auth\/reissue$/;
  // store에서 state 가져옴
  let { accessToken } = store.getState().auth;
  
  try {
    // 1. 엑세스 토큰이 있고 `/api/auth/reissue` 가 아닌 경우
    if(accessToken && !noRetry.test(config.url)) {
      // 엑세스 토큰 만료 확인 : 5분 이내인지
      const claims = jwtDecode(accessToken);
      const now = dayjs().unix();
      const expTime = dayjs.unix(claims.exp).add(-5, 'minute').unix();
      
      // 1-1. 엑세스 토큰의 만료시간이 5분 이하면, 엑세스 토큰 새로 담기
      if(now >= expTime) {
        // console.log('만료 5분 이내 토큰 재발급');
        const response = await store.dispatch(reissueThunk()).unwrap();
        accessToken = response.data.accessToken;
      }
  
      // 1-2. 엑세스 토큰의 만료시간이 5분 이상인 경우 헤더에 베어러 토큰 설정
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  } catch (error) {
    console.error('axios Interceptor : ', error)
    // thunk에서 에러 처리로 넘어감
    return Promise.reject(error);
  }
});

export default axiosIns;