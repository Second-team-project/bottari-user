import "./SelectLuggageModal.css";

import { useEffect, useState } from "react";

export default function SelectLuggageModal({modalFlgFalse, setLuggageInfo}) {
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
  // ||     짐 선택하기     ||
  // ===== 짐 종류
  const [step1, setStep1] = useState(null); // 종류
  const [step2, setStep2] = useState(null); // 사이즈
  const [step3, setStep3] = useState(null); // 무게

  const step1List = ['캐리어', '가방', '골프 가방', '상자']
  const step2List = (step1 === '캐리어') ? ['21', '24', '32', '초과'] : ['S', 'M', 'L', 'XL']
  const step3List = ['~10kg', '~20kg', '~30kg', '초과']

  // ===== 최종 선택 완료
  const handleComplete = () => {
    setLuggageInfo({type: step1, size: step2, weight: step3});
    modalFlgFalse(false);
  };

  return(
    <>
      {/* 블러 배경 */}
      <div className="select-luggage-modal-backgound" onClick={() => modalFlgFalse() }></div>
      {/* 컨텐츠 영역 */}
      <div className="select-luggage-modal-container">
        {/* 페이지 제목 */}
        <div className="select-luggage-modal-wrapper page-modal-title-wrapper">
          <h3 className="select-luggage-modal-title">보따리 종류 선택</h3>
        </div>

        {/* 보따리 영역 */}
        <div className="select-luggage-modal-input-container">

          {/* 종류 */}
          <div className="select-luggage-modal-input-wrapper">
            <div className="select-luggage-modal-input-title-wrapper">
              <h3>보따리 종류</h3>
            </div>
            <div className="select-luggage-modal-input-type-btn-wrapper">
              {
                step1List.map(item => (
                  <button key={item} 
                    className={`select-luggage-modal-input-type-btn select-luggage-modal-input-type-btn-${step1 === item ? 'active' : '' }`}
                    onClick={() => { setStep1(item); setStep2(null); setStep3(null); }}
                  >{item}</button>
                ))
              }
            </div>
          </div>

          {/* 크기 */}
          {
            step1 && (
              <div className="select-luggage-modal-input-wrapper">
                <div className="select-luggage-modal-input-title-wrapper">
                  <h3>보따리 크기</h3>
                </div>
                <div className="select-luggage-modal-input-type-btn-wrapper">
                  {
                    step2List.map(item => (
                      <button key={item} 
                        className={`select-luggage-modal-input-type-btn select-luggage-modal-input-type-btn-${step2 === item ? 'active' : '' }`}
                        onClick={() => { setStep2(item); setStep3(null); }}
                      >{item}</button>
                    ))
                  }
                </div>
              </div>
            )
          }

          {/* 무게 */}
          {
            step2 && (
              <div className="select-luggage-modal-input-wrapper">
                <div className="select-luggage-modal-input-title-wrapper">
                  <h3>보따리 무게</h3>
                </div>
                <div className="select-luggage-modal-input-type-btn-wrapper">
                  {
                    step3List.map(item => (
                      <button key={item} 
                        className={`select-luggage-modal-input-type-btn select-luggage-modal-input-type-btn-${step3 === item ? 'active' : '' }`}
                        onClick={() => { setStep3(item); }}
                      >{item}</button>
                    ))
                  }
                </div>
              </div>
            )
          }

          {/* 버튼 영역 */}
          <div className="select-luggage-modal-complete-btn-wrapper">
            {/* 취소 */}
            <button className="select-luggage-modal-complete-btn select-luggage-modal-complete-btn-cancel"
              onClick={() => { modalFlgFalse() }}
            >취소</button>

            {/* 완료 */}
          {
            step3 && (
              <button className="select-luggage-modal-complete-btn select-luggage-modal-complete-btn-save"
                onClick={() => { modalFlgFalse(); handleComplete() }}
              >완료</button>
            )
          }
          </div>
          

        </div>

      </div>
    </>
  )
};