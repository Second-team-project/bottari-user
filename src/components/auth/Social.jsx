import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"

import { reissueThunk } from "../../store/thunks/authThunk.js";

export default function Social() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    async function getAuth() {
      try {
        await dispatch(reissueThunk());
        navigate('/posts', { replace: true });

      } catch (error) {
        console.log('Social: ', error);
        alert('소셜 로그인 실패');
        navigate('/login', { replace: true });
      }
    }
    getAuth();
  }, []);

  return (
    <>
      <p>로그인 중</p>
    </>
  )
}