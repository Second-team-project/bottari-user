import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom"

import { reissueThunk } from "../../store/thunks/authThunk.js";
import { toast, Toaster } from "sonner";
import Loading from "../common/Loading.jsx";

export default function Social() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const errorMsg = searchParams.get('error');

  useEffect(() => {
    // 에러메세지 쿼리가 있으면 쫓아냄
    if (errorMsg) {
      toast.error(decodeURIComponent(errorMsg));

      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000)
      // reissueThunk 실행 안 함
      return () => clearTimeout(timer); 
    }

    // 에러가 없으면 정상 로그인 진행
    async function getAuth() {
      try {
        const result = await dispatch(reissueThunk()).unwrap();
        console.log('✅ 액세스 토큰 발급 성공:', result);  // 여기!
        console.log('액세스 토큰:', result.data?.accessToken);
        await dispatch(reissueThunk());
        navigate('/', { replace: true });

      } catch (error) {
        console.log('Social: ', error);
        toast.error('소셜 로그인 실패');
        navigate('/login', { replace: true });
      }
    }
    getAuth();
  }, [errorMsg]);

  return (
    <>
      <Toaster position="top-center" />
      <Loading text="로그인 중..." />
    </>
  )
}