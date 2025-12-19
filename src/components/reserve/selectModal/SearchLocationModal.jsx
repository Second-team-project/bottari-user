import "./SearchLocationModal.css";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { searchLocationThunk } from "../../../store/thunks/searchThunk.js"

// icon
import { X } from 'lucide-react';

export default function SearchLoationModal({ modalFlgFalse, setLocation, location }) {
  // ===== hook
  const dispatch = useDispatch()

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
  const [resultList, setResultList] = useState([]);

  // ===== 검색
  const firstSearch = async (keyword) => {
    setPage(1);  // 검색할 때마다 page 1로 초기화

    const result = await dispatch(searchLocationThunk({ keyword, page: 1}));
    setResultList(result.payload.data);

    console.log('resultList: ', result.payload.data)
  };

  // ===== 검색어 선택
  function selectSearch(keyword) {
    modalFlgFalse();
    setLocation(keyword);
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
            onChange={e => setKeyword(e.target.value)}
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
            resultList.length !== 0 && resultList.map((item, index) => (
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