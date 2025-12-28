/**
 * @file GuestRoute.jsx
 * @description 비로그인 사용자만 접근 가능한 라우트 가드
 * 로그인 상태면 홈으로 리다이렉트
 */

import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function GuestRoute({ children }) {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const loading = useSelector(state => state.auth.loading);

  // 인증 체크 중이면 대기
  if (loading) {
    return null;
  }

  // 로그인 상태면 홈으로
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // 비로그인이면 통과
  return children;
}
