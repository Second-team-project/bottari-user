import "./SearchLocationModal.css";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { searchLocationThunk } from "../../../store/thunks/searchThunk.js"

// icon
import { X } from 'lucide-react';
import { toast } from "sonner";

export default function SearchLocationModal({ modalFlgFalse, setLocation, location }) {
  // ===== hook
  const dispatch = useDispatch()
  // ===== error state
  const [errorMsg, setErrorMsg] = useState()

  // ========================
  // ||     스크롤 방지     ||
  // ========================
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // ======================== 
  // ||     주소 검색용     ||
  // ===== local state
  const [keyword, setKeyword] = useState(location || '');
  const [page, setPage] = useState(1);
  const [resultList, setResultList] = useState(null);

  // ===== 검색
  const firstSearch = async (keyword) => {
    // 유효성 검사
    if(!keyword || keyword.trim() === '') {
      toast.error('검색하려는 주소를 입력 해주세요');
      return;
    }
    if(keyword.trim().length < 2) {
      toast.error('검색어는 최소 2글자 이상입니다');
      return;
    }
    // 유효성 검사 통과
    setErrorMsg('');
    setPage(1);  // 검색할 때마다 page 1로 초기화

    const result = await dispatch(searchLocationThunk({ keyword, page: 1}));
    // 백엔드 에러 처리
    if(result.error) {
      // setErrorMsg(result.payload?.response?.data?.message || '검색 중 오류가 발생했습니다');
      toast.error('검색 중 오류가 발생했습니다')
      return;
    }
    // 백엔드 에러 없으면 list 담기
    setResultList(result.payload.data);
    if(result.payload.data < 1) {
      toast.error('검색 결과가 없습니다')
    }
  };

  // ===== 검색어 선택
  function selectSearch(keyword) {
    if (!keyword.startsWith('대구')) {
      toast.error(<div>서비스 지역이 아닙니다.<br />대구 지역만 선택 가능합니다.</div>);
      return;
    }
    modalFlgFalse();
    setLocation(keyword.trim());
  }




  return(
    <>
      {/* 블러 배경 */}
      <div className="search-location-modal-backgound" onClick={() => modalFlgFalse() }></div>
      {/* 컨텐츠 영역 */}
      <div className="search-location-modal-container">
        {/* 페이지 제목 */}
        <div className="search-location-modal-wrapper page-modal-title-wrapper">
          <h3 className="search-location-modal-title">주소 검색</h3>
        </div>

        {/* 검색 영역 */}
        <div className="search-location-modal-input-wrapper">
          <input 
            type="text" 
            className="reserve-form-content-input" 
            value={keyword}
            placeholder="2글자 이상 검색해 주세요"
            onChange={e => {
              setKeyword(e.target.value);
              if(errorMsg){setErrorMsg('')};  // 검색어 입력시 에러메세지 초기화
            }}
            onKeyDown={e => { if (e.key === 'Enter') firstSearch(keyword); }}
          />
          <span className="search-location-modal-input-x"
            onClick={() => setKeyword('')}
          ><X size={24}/></span>
          <button type="button" className="search-location-modal-input-btn" onClick={e => firstSearch(keyword)}>검색</button>
        </div>

        {/* 검색 결과 영역 */}
        <div className="search-location-modal-result-container">
          {
            resultList && resultList.map((item, index) => (
              <div
                className="search-location-modal-result-wrapper"
                key={index}
                onClick={() =>selectSearch(item.address_name)}
              >
                <span>{item.road_address_name}</span>
                <span>( {item.address_name} )</span>
              </div>
            ))
          }
        </div>


      </div>
    </>
  )
}