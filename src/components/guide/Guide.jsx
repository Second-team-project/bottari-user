import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import './Guide.css';

import { useSelector } from 'react-redux';
import { motion } from "framer-motion";

export default function Guide() {
  // ===== redux states
  const priceList = useSelector(state => state.guideImg.priceList);
  const usageList = useSelector(state => state.guideImg.usageList);
  const loading = useSelector(state => state.guideImg.loading);

  return(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >

      {/* 전체 컨테이너 */}
      <div className="guide-container">
        {/* 페이지 제목 */}
        <div className="guide-title-wrapper page-title-wrapper">
          <h2 className="guide-title">요금 안내</h2>
        </div>

        <div className="guide-price-img-container">
          {
            loading || !priceList?.length ? (
              <Skeleton height={500} width="100%" />
            ) : (
              <img className="guide-price-img" src={priceList[0]?.img} alt={priceList[0]?.title || '가격 안내'} />

            )
          }
        </div>

        {/* 페이지 제목 */}
        <div className="reserve-list-login-modal-title-wrapper page-modal-title-wrapper">
          <h2 className="reserve-list-login-modal-title">이용 안내</h2>
        </div>

        <div className="guide-usage-img-container">
          {
            loading || !usageList?.length ? (
              <Skeleton height={500} width="100%" />
            ) : (
              <img className="guide-usage-img" src={usageList[0]?.img} alt={usageList[0]?.title || '이용 안내'} />
            )
          }
        </div>

      </div>


    </motion.div>
  )
};
