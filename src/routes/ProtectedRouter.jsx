import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

import { clearAuth } from "../store/slices/authSlice.js";
import { reissueThunk } from "../store/thunks/authThunk.js";

import { toast } from "sonner";

// 로그인 필요한 라우트
const AUTH_REQUIRED_ROUTES = [
  /^\/review\/create$/,
]
// 비로그인만 접근 가능한 라우트
const GUEST_ONLY_ROUTES = [
  /^\/login$/,
]

// 유저 인증 및 인가 처리 담당
export default function ProtectedRouter() {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(state => state.auth);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const hasRedirected = useRef(false);

  // 토큰 재발급 시도 (새로고침 대응)
  useEffect(() => {
    async function checkAuth() {
      if (!isLoggedIn) {
        try {
          await dispatch(reissueThunk()).unwrap();
        } catch (error) {
          console.error('프로텍트라우터 재발급 실패: ', error);
          dispatch(clearAuth());
        }
      }
      setIsAuthChecked(true);
    }
    checkAuth();
  }, [dispatch]);

  // 경로 바뀌면 리다이렉트 플래그 리셋
  useEffect(() => {
    // hasRedirected.current = false;

    if (!isAuthChecked) return; // 인증 체크 전이면 무시

    const isGuestRoute = GUEST_ONLY_ROUTES.some(regex => regex.test(pathname));
    const isAuthRoute = AUTH_REQUIRED_ROUTES.some(regex => regex.test(pathname));

    // 1. 로그인 상태인데 게스트 페이지 접근 (예: /login)
    if (isGuestRoute && isLoggedIn) {
      navigate('/', { replace: true });
      return;
    }

    // 2. 비로그인 상태인데 인증 페이지 접근 (예: /review/create)
    if (isAuthRoute && !isLoggedIn) {
      toast.error('로그인이 필요한 서비스입니다.');
      navigate('/login', { replace: true })
    }
  }, [isAuthChecked, isLoggedIn, pathname, navigate]);

  // 3. 렌더링 결정
  if (!isAuthChecked) return null; // 로딩 중

  // 리다이렉트 조건에 걸리는 상황이면(useEffect에서 처리될 예정이므로) 일단 빈 화면 반환
  const isGuestRoute = GUEST_ONLY_ROUTES.some(regex => regex.test(pathname));
  const isAuthRoute = AUTH_REQUIRED_ROUTES.some(regex => regex.test(pathname));
  
  if ((isGuestRoute && isLoggedIn) || (isAuthRoute && !isLoggedIn)) {
    return null; // 화면 깜빡임 방지
  }

  // 인증 체크 중이면 대기
  if (!isAuthChecked) {
    return null;
  }


  // // 1. 게스트 전용 라우트 (로그인 시 홈으로)
  // const isGuestRoute = GUEST_ONLY_ROUTES.some(regex => regex.test(pathname));
  // if (isGuestRoute && isLoggedIn) {
  //   return <Navigate to="/" replace />;
  // }

  // // 2. 로그인 필요 라우트 (비로그인 시 이전 페이지로)
  // const isAuthRoute = AUTH_REQUIRED_ROUTES.some(regex => regex.test(pathname));
  // if (isAuthRoute && !isLoggedIn) {
  //   if (!hasRedirected.current) {
  //     hasRedirected.current = true;
  //     toast.error('로그인이 필요한 서비스입니다.');
  //     setTimeout(() => navigate(-1), 100);
  //   }
  //   return null;
  // }

  return <Outlet />


}