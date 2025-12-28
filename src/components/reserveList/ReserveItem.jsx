import "./ReserveItem.css";

import { useState } from "react";
import { Truck, Package, ChevronDown, ChevronUp } from 'lucide-react';
import dayjs from "dayjs";

export default function ReserveItem({ data }) {
  const [isOpen, setIsOpen] = useState(false)

  // data 가공
  const isDelivery = data.code.startsWith('D');
  const typeClass = isDelivery ? 'd' : 's';
  const typeText = isDelivery ? '배송' : '보관';
  const stateText = data.state?.trim().toLowerCase();

  let statusLabel = '';
  switch(data.state) {
    case 'RESERVED':
      statusLabel = '예약 완료';
      break;
      case 'IN_PROGRESS':
        statusLabel = isDelivery ? ( // 타입에 따라 분기
          <span className="reserve-list-tag-inner">
          배송 중 <Truck size={20} />
        </span>
      ) : (
        <span className="reserve-list-tag-inner">
          보관 중 <Package size={20} />
        </span>
      ) 
      break;
    case 'COMPLETED':
      statusLabel = <span className="reserve-list-tag-inner">이용 완료</span>;
      break;
    case 'CANCELLED':
      statusLabel = <span className="reserve-list-tag-inner">예약 취소</span>;
      break;
    default:
      statusLabel = <span className="reserve-list-tag-inner">{data.state}</span>;
  }

  return(
    <div className="reserve-list-content-body">
    
      {/* 상단 */}
      <div className="reserve-list-content-header">
        {/* 보관/배송 타입 */}
        <div className={`reserve-list-tag reserve-list-type-${typeClass}`}>
          <span className="reserve-list-tag-inner">{typeText}</span>
        </div>
        {/* 예약/배송/보관/완료/취소 상태 */}
        <div className={`reserve-list-tag reserve-list-status-${stateText}`}>
          {statusLabel}
        </div>
      </div>

      {/* 중간 */}

      {/* 배송인 경우 */}
      {
        isDelivery && (
          <div className="reserve-list-content-container">

            {/* 중간 */}
            <div className="reserve-list-content-left">
              <span>{dayjs(data.startedAt).format('YYYY년 MM월 DD일 HH:mm')} 픽업</span>
            </div>

            {/* 하단 */}
            <div className="reserve-list-content-right">
              <span>{data.startedAddr} 에서</span>
              <span>{data.endedAddr} 까지</span>
            </div>

          </div>
        )
      }

      {/* 보관인 경우 */}
      {
        !isDelivery && (
          <div className="reserve-list-content-container">

            {/* 중간 */}
            <div className="reserve-list-content-left">
                <span>{data.storeName} 보관소</span>
            </div>

            {/* 하단 */}
            <div className="reserve-list-content-right">
              <span>{dayjs(data.startedAt).format('YYYY년 MM월 DD일 HH:mm')} 부터</span>
              <span>{dayjs(data.endedAt).format('YYYY년 MM월 DD일 HH:mm')} 까지</span>
            </div>

          </div>
        )
      }

      {/* 하단 */}
      <div className="reserve-list-bottom">
        {/* 아코디언 열기 버튼 */}
        <span className="reserve-list-icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </span>

      </div>

      {/* 아코디언 내용 */}
      {
        isOpen && (
          <div className="reserve-list-content-container">

            <div className="reserve-list-content-wrapper">
              <span>예약 코드</span>
              <span>{data.code}</span>
            </div>

            <div className="reserve-list-content-wrapper">
              <span>결제 금액</span>
              <span>{data.price?.toLocaleString()}</span>
            </div>

            <div>
              <div className="reserve-list-content-left">
                <span>요구 사항</span>
              </div>
              <div className="reserve-list-content-right">
                <span>{data.notes}</span>
              </div>
            </div>

            <div>
              <div className="reserve-list-content-left">
                <span>보따리 정보</span>
              </div>
              {
                data.luggageList && data.luggageList.map( (luggage, index) => (
                  <div className="reserve-list-content-right" key={index}>
                    <span>{luggage.itemType} ({luggage.itemSize}) {luggage.itemWeight} {luggage.count}개</span>
                  </div>
                ))
              }
            </div>

            {
              data.state === 'RESERVED' ? (
                <div className="reserve-list-content-right">
                  <div className="reserve-list-tag reserve-list-cancel-btn">예약 취소</div>
                </div>
              ) : (
                <div className="reserve-list-empty-space">
                </div>
              )
            }

          </div>
        )
      }
    
    </div>
  )
}