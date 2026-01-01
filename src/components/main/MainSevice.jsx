import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import "./MainService.css";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

export default function MainService() {
  // ===== redux  states
  const serviceList = useSelector(state => state.guideImg.serviceList);
  const loading = useSelector(state => state.guideImg.loading);

  console.log('loading:', loading, 'serviceList:', serviceList);

  // const serviceInfos = [
  //   { id: 1, title: "맡기기", description: "여행 중 짐을 안전하게 보관하세요" },
  //   { id: 2, title: "옮기기", description: "원하는 장소로 짐을 배송해드려요" },
  //   { id: 3, title: "간편 예약", description: "몇 번의 터치로 간편하게 예약" },
  // ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="main-banner-container">
        {
          loading || !serviceList?.length ? (
            <Skeleton height={500} width="100%" />
          ) : (
            <div className="main-banner" style={{ backgroundImage: `url(${serviceList[0]?.img})` }}></div>

          )
        }
      </div>

      {/* 서비스 소개 */}
      {/* <div className="main-service-container">
        <h2 className="main-service-title">보따리 서비스</h2>
        <div className="main-service-list">
          {serviceInfos.map((info) => (
            <div key={info.id} className="main-service-item">
              <div className="main-service-image">
                <span>{info.title}</span>
              </div>
              <h3>{info.title}</h3>
              <p>{info.description}</p>
            </div>
          ))}
        </div>
      </div> */}
      
    </motion.div>
  );
}