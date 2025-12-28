import "./SelectLuggageModal.css";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { getPricing } from "../../../store/thunks/pricingThunk.js";
import { Minus, Plus  } from 'lucide-react';
import { toast } from "sonner";

export default function SelectLuggageModal({ serviceType, modalFlgFalse, setLuggageList}) {
  // ===== hooks
  const dispatch = useDispatch();

  // ========================
  // ||     스크롤 방지     ||
  // ========================
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // =============================
  // ||     가격 정보 가져오기     ||
  // =============================
  const [pricingList, setPricingList] = useState([])

  useEffect(() => {
    dispatch(getPricing()).unwrap()
    .then(res => {
      if(serviceType) {
        const typeFiltered = res.data.filter(item => item.serviceType === serviceType);
        setPricingList(typeFiltered);
      } else {
        toast.error('오류가 발생했습니다. 재시도 해주세요.');
        modalFlgFalse();
      }
    });
  }, [dispatch, serviceType]);

  // ========================
  // ||     짐 선택하기     ||
  // ===== 짐 종류
  const [step1, setStep1] = useState(null); // 종류
  const [step2, setStep2] = useState(null); // 사이즈
  const [step3, setStep3] = useState(null); // 무게
  const [count, setCount] = useState(1); // 개수

  const step1List = pricingList?.length > 0
    ? [...new Set(pricingList.map(item => item.itemType))]
    : [];

  const step2List = 
    pricingList && pricingList
    .filter(item => item.itemType === step1) // step1에 해당하는 타입 중
    .map(item => item.itemSize)              // 사이즈 뽑아내고
    .filter((value, index, self) => self.indexOf(value) === index); // 중복 제거
  
  const step3List =
    pricingList && pricingList
    .filter(item => item.itemType === step1 && item.itemSize === step2) // step1 타입의 step2 사이즈의
    .map(item => item.itemWeight)                                       // 무게만 뽑아냄
    .filter((value, index, self) => self.indexOf(value) === index);     // 중복 제거

  const selectedItem =
    (step1 && step2 && step3) 
    ? pricingList.find(item => item.itemType === step1 && item.itemSize === step2 && item.itemWeight === step3)
    : null;

   const unitPrice = selectedItem ? Number(selectedItem.basePrice) : 0;
   const totalPrice = unitPrice * count;


  // ===== 최종 선택 완료
  const handleComplete = () => {
    setLuggageList({
      itemType: step1,
      itemSize: step2,
      itemWeight: step3,
      count: count,
      price: totalPrice,
    });
    modalFlgFalse(false);
  };

  // ===== 한글 맵핑용
  const TYPE_LABELS = {
    'CARRIER': '캐리어',
    'BAG': '가방',
    'BOX': '상자',
    'GOLF': '골프가방',
  }
  
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
        <div className="select-luggage-modal-body">

          {/* 선택 영역 */}
          <div className="select-luggage-modal-select-container">

          {/* 종류 */}
          <div className="select-luggage-modal-input-wrapper">
            <div className="select-luggage-modal-input-title-wrapper">
              <span>종류</span>
            </div>
            <div className="select-luggage-modal-input-type-btn-wrapper">
              {
                step1List.map(item => (
                  <button key={item} 
                  className={`select-luggage-modal-input-type-btn select-luggage-modal-input-type-btn-${step1 === item ? 'active' : '' }`}
                  onClick={() => { setStep1(item); setStep2(null); setStep3(null); }}
                  >{TYPE_LABELS[item]}</button>
                ))
              }
            </div>
          </div>

          {/* 크기 */}
          {
            step1 && (
              <div className="select-luggage-modal-input-wrapper">
                <div className="select-luggage-modal-input-title-wrapper">
                  <span>크기</span>
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
            ( step2 || step2List.length === 0 ) && (
              <div className="select-luggage-modal-input-wrapper">
                <div className="select-luggage-modal-input-title-wrapper">
                  <span>무게</span>
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

          {/* 개수 */}
          {
            step3 && (
              <div className="select-luggage-modal-input-wrapper">
                <div className="select-luggage-modal-input-title-wrapper">
                  <span>개수</span>
                </div>
                <div className="select-luggage-modal-input-type-btn-wrapper-center">
                  <div className="select-luggage-modal-luggage-count-btn"
                    onClick={() => setCount(prev => Math.max(prev - 1, 1))}
                    ><Minus /></div>
                  <div className="select-luggage-modal-luggage-count">{count}</div>
                  <div className="select-luggage-modal-luggage-count-btn"
                    onClick={() => setCount(prev => Math.min(prev + 1, 9))}
                    ><Plus /></div>
                </div>
              </div>
            )
          }

          {/* 가격 */}
          {
            step3 && (
              <div className="select-luggage-modal-input-wrapper">
                <div className="select-luggage-modal-input-title-wrapper">
                  <span>가격</span>
                </div>
                <div className="select-luggage-modal-input-type-btn-wrapper-center">
                  <div className="select-luggage-modal-luggage-price">{totalPrice}</div>
                  <div className="select-luggage-modal-luggage-count">원</div>
                </div>
              </div>
            )
          }
          
          </div>

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