import "./ReserveItem.css";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { Truck, Package, ChevronDown, ChevronUp, MapPin, ArrowBigDown, Clock4, CircleAlert } from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";

import RecheckModal from "./RecheckModal.jsx";
import { getDriverLocation } from "../../store/thunks/driverLocatinThunk.js";

export default function ReserveItem({ data }) {
  // code: "DM251227G5H6I"
  // endedAddr: "대구 동구 아양로 200"
  // id: 3
  // luggageList: [{…}]
  // notes: "문 앞에 놔주세요"
  // price: 18000
  // startedAddr: "대구 북구 대학로 80"
  // startedAt: "2025-12-30T02:36:44.000Z"
  // state: "IN_PROGRESS"

  // ===== hooks
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  // ===== redux states
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  // ===== local states
  const [isOpen, setIsOpen] = useState(false);
  const [recheckFlg, setRecheckFlg] = useState(false);
  // === driver
  const [driverInfo, setDriverInfo] = useState(null);
  const [isLoadingDriver, setIsLoadingDriver] = useState(false);
  // data 가공
  const isDelivery = data.code.startsWith('D');
  const typeClass = isDelivery ? 'd' : 's';
  const typeText = isDelivery ? '배송' : '보관';
  const stateText = data.state?.trim().toLowerCase();
  const isProgress = data.state === 'RESERVED' || data.state === 'IN_PROGRESS' || data.state === 'COMPLETED';

  let statusLabel = '';
  let statusDesc = '';
  switch(data.state) {
    case 'RESERVED':
      statusLabel = '예약 완료';
      statusDesc = isDelivery
        ? <span className="reserve-item-status-desc"><CircleAlert size={20} />기사님의 출발을 기다리고 있어요.</span>
        : <span className="reserve-item-status-desc"><Clock4 size={20} />보관 시작을 기다리고 있어요.</span>
      break;
    case 'PICKING_UP':
      statusLabel = <span className="reserve-list-tag-inner">픽업중 <Truck size={20} /></span>;
      statusDesc = <span className="reserve-item-status-desc"><Truck size={20} />기사님이 고객님의 보따리를 가지러 가고 있어요.</span>
      break;
    case 'IN_PROGRESS':
      statusLabel = isDelivery ? ( // 타입에 따라 분기
        <span className="reserve-list-tag-inner">배송 중</span>
      ) : (
        <span className="reserve-list-tag-inner">보관 중</span>
      ) 
      statusDesc = isDelivery
        ? <span className="reserve-item-status-desc">고객님의 보따리가 목적지로 이동 중이에요.<Truck size={20} /></span>
        : <span className="reserve-item-status-desc">고객님의 보따리가 안전하게 보관되고 있어요.<Package size={20} /></span>
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

  useEffect(() => {
    if( isDelivery && isProgress && isOpen && !driverInfo) {
      setIsLoadingDriver(true);

      dispatch(getDriverLocation(data.id)).unwrap()
        .then(res => {
          console.log('기사 정보 불러오기: ', res.data)
          setDriverInfo(res.data);
        })
        .catch(err => {
          const errorCode = err.response?.data?.code || err.code;
          if (errorCode === 'NO_ASSIGNMENT_ERROR' || err.status === 404) {
            console.error("배정 기사 없음: ", err);
          } else {
          toast.error("통신 오류가 발생했습니다.");
          console.error("기사 정보 조회 실패: ", err);
          }
          setDriverInfo(null);
        })
        .finally(() => setIsLoadingDriver(false));
    } 
  }, [isOpen, isDelivery, isProgress, data.id, driverInfo, dispatch])

  return(
    <div className="reserve-list-content-body">
      {/* 예약 취소 모달 */}
      <AnimatePresence>
        {
          recheckFlg &&
          <RecheckModal
            modalFlgfalse={() => setRecheckFlg(false)}
            data={data}
          />
        }
      </AnimatePresence>
    
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
      {
        statusDesc && (
          <span className="reserve-item-status-desc-wrapper">{statusDesc}</span>
        )
      }

      {/* 배송인 경우 */}
      {
        isDelivery && (
          <div className="reserve-list-content-container">

            {/* 중간 */}
            <div className="reserve-list-content-left border-bottom-offwhite">
              <span className="color-darkslate">{dayjs(data.startedAt).format('YYYY년 MM월 DD일 HH:mm')} 픽업</span>
            </div>

            {/* 하단 */}
            <div className="reserve-list-content-right border-bottom-offwhite">
              <span>{data.startedAddr} 에서</span>
              <span className="reserve-confirm-arrow"><ArrowBigDown size={20} /><span className="reserve-confirm-margin-right-4-rem">{'   '}</span></span>
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
                <span className="color-darkslate">{data.storeName} 보관소</span>
            </div>

            {/* 하단 */}
            <div className="reserve-list-content-right">
              <span>{dayjs(data.startedAt).format('YYYY년 MM월 DD일 HH:mm')} 부터</span>
              <span className="reserve-confirm-arrow"><ArrowBigDown size={20} /><span className="reserve-confirm-margin-right-4-rem">{'   '}</span></span>
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
      <AnimatePresence>
        {
          isOpen && (
            <motion.div
              className="reserve-list-content-container"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >

              <div className="reserve-list-content-wrapper">
                <span className="reserve-list-content-left">예약 코드</span>
                <span>{data.code}</span>
              </div>

              <div className="reserve-list-content-wrapper">
                <span className="reserve-list-content-left">결제 금액</span>
                <span>{data.price?.toLocaleString()} 원</span>
              </div>

              <div>
                <div className="reserve-list-content-left">
                  <span className="reserve-list-content-left">요구 사항</span>
                </div>
                <div className="reserve-list-content-right">
                  <span>{data.notes}</span>
                </div>
                <hr className="reserve-list-line" />
              </div>

              <div>
                <div className="reserve-list-content-left">
                  <span className="reserve-list-content-left">보따리 정보</span>
                </div>
                {
                  data.luggageList && data.luggageList.map( (luggage, index) => (
                    <div className="reserve-list-content-right" key={index}>
                      <span>{luggage.itemType} ({luggage.itemSize}) {luggage.itemWeight} {luggage.count}개</span>
                    </div>
                  ))
                }
                <hr className="reserve-list-line" />
              </div>

              <div className="reserve-list-empty-space"></div>


              {
                isDelivery && isProgress && (
                  <>
                    <div className="reserve-list-content-wrapper">
                      <span className="reserve-list-content-left">배정 기사</span>
                      <span>{isLoadingDriver ? '불러오는 중...' : (driverInfo?.driverName || '미배정')}</span>
                    </div>
                    <div className="reserve-list-content-wrapper">
                      <span className="reserve-list-content-left">기사 연락처</span>
                      <span>{isLoadingDriver ? '불러오는 중...' : (driverInfo?.phone || '미배정')}</span>
                    </div>
                    <div className="reserve-list-content-wrapper">
                      <span className="reserve-list-content-left">배송 차량 번호</span>
                      <span>{isLoadingDriver ? '불러오는 중...' : (driverInfo?.carNumber || '미배정')}</span>
                    </div>
                    <div className="reserve-list-empty-space">
                    </div>
                  </>
              )
              }
              {
                (data.state === 'RESERVED' && !driverInfo && !isLoadingDriver) && (
                  <div className="reserve-list-content-right">
                    <div className="reserve-list-tag reserve-list-cancel-btn" onClick={() => setRecheckFlg(true)}>예약 취소</div>
                  </div>
                )
              }
              {data.state === 'IN_PROGRESS' && driverInfo?.lat && driverInfo?.lng && (
                <>
                  <hr className="reserve-list-line" />
                  <div className="reserve-list-content-wrapper reserve-item-align-center">
                    <span>기사님 위치</span>
                    <span>
                      <button type="button" className="reserve-item-map-btn" 
                        onClick={() => {
                          if (mapRef.current) {
                            mapRef.current.panTo(new kakao.maps.LatLng(driverInfo.lat, driverInfo.lng));
                          }
                        }}
                      ><MapPin size={24} /></button>
                    </span>
                  </div>
                  <div className="reserve-item-map-wrapper">
                  <Map
                    center={{ lat: Number(driverInfo.lat), lng: Number(driverInfo.lng) }} // 지도의 중심 좌표
                    style={{ width: "100%", height: "100%" }} // 지도 크기
                    level={5} // 확대 레벨
                    ref={mapRef}
                  >
                    {/* 기사님 위치에 핀(마커) 표시 */}
                    <MapMarker
                      position={{ lat: Number(driverInfo.lat), lng: Number(driverInfo.lng) }}
                      image={{ src: "/bottari-pick.png", size: { width: 35, height: 35 } }}
                    ></MapMarker>
                    <CustomOverlayMap
                      position={{ lat: Number(driverInfo.lat), lng: Number(driverInfo.lng) }}
                      yAnchor={2.5}
                    >
                    <div className="reserve-item-map-picker">
                      보따리가 가고 있어요!
                    </div>
                    </CustomOverlayMap>
                  </Map>

                </div>
                <div className="reserve-list-empty-space"></div>
                </>

                )
              }

            </motion.div>
          )
        }
      </AnimatePresence>
    
    </div>
  )
}