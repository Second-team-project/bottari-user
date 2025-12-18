import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { clearAuth } from "../store/slices/authSlice.js";
import { reissueThunk } from "../store/thunks/authThunk.js";

// 유저 권한
const ROLE = {
  NONE: 'NONE',
  GUEST: 'GUEST',
  MEMBER: 'MEMBER',
}
const { NONE, GUEST, MEMBER } = ROLE;

// 인증 및 인가가 필요한 라우트만 정의
const AUTH_REQUIRED_ROUTES = [
  { path: /^\/users\/[0-9]+$/, roles: [MEMBER] },
  { path: /^\/review\/create+$/, roles: [MEMBER] },
]
// 비로그인만 접근 허용하는 라우트 정의
const GUEST_ONLY_ROUTES = [
  /^\/login$/,
  /^\/registration$/,
]

// 유저 인증 및 인가 처리 담당
export default function ProtectedRouter() {
  const { isLoggedIn, user, } = useSelector(state => state.auth)
  const location = useLocation();
  const dispatch = useDispatch();
  const [ isAuthChecked, setIsAuthChecked] = useState(false);

  // 엑세스 토큰이 없을 경우, 토큰 재발급 시도 (브라우저의 새로고침 등 메모리 초기화 대응)
  useEffect(() => {
    async function checkAuth() {
      if(!isLoggedIn) {
        try {
          await dispatch(reissueThunk()).unwrap();
        } catch(error) {
          console.log('ProtecedRouter.useEffect.reissue :', error)
          dispatch(clearAuth());
        }
      }
      setIsAuthChecked(true);
    }
    checkAuth();
  }, []);

  // ProtectedRouter 재발급시 처리 여부 체크
  if(!isAuthChecked) {
    return <></>;
    // 아래 로직 진행 안 됨!
  }


  // 게스트 라우트 확인
  const isGuestRoute = GUEST_ONLY_ROUTES.some(regx => regx.test(location.pathname));

    // 1. 게스트 라우트 인 경우
  if(isGuestRoute) {
    // 1-1. 로그인 한 상태라면
    if(isLoggedIn) {
      // '/posts'로
      return <Navigate to="/posts" replace />
    }
    // 2. 게스트 라우트 아니라면
  } else {
    // 요청에 맞는 권한 규칙 조회
    const matchRole = AUTH_REQUIRED_ROUTES.find(item => item.path.test(location.pathname));
    // 2-1. 일치하는 권한 규칙 있을 시, 인증 및 권한 체크
    if(matchRole) {
      // 인증 체크
      // 2-1-1. 로그인 되어있는 경우
      if(isLoggedIn) {
        // 권한 체크
        if(matchRole.roles.includes(user.role)) {
          return <Outlet />;
        } else {
          alert ('권한이 부족하여 사용할 수 없습니다.')
          return <Navigate to='/posts' replace />
        }
      // 2-1-2. 로그인 되어있지 않는 경우
      } else {
        alert('로그인이 필요한 서비스입니다.');
        return <Navigate to='/login' replace />
      }
    }
  }

  return <Outlet />


}