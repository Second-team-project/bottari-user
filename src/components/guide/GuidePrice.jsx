import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import "./GuidePrice.css";
import { useSelector } from 'react-redux';
import { motion } from "framer-motion";

export default function GuidePrice() {
  // ===== redux states
  const priceList = useSelector(state => state.guideImg.priceList);
  const loading = useSelector(state => state.guideImg.loading);

  return(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 전체 컨테이너 */}
      <div className="guide-price-container">
        {/* 페이지 제목 */}
        <div className="guide-price-title-wrapper page-title-wrapper">
          <h2 className="guide-price-title">요금 안내</h2>
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
      </div>
    </motion.div>
  )
}