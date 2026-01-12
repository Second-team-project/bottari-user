import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import "./GuideUsage.css";

import { useSelector } from 'react-redux';
import { motion } from "framer-motion";

export default function GuideUsage() {
  // ===== redux states
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
      <div className="guide-usage-container">
        {/* 페이지 제목 */}
        <div className="guide-usage-title-wrapper page-title-wrapper">
          <h2 className="guide-usage-title">이용 안내</h2>
        </div>
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
    </motion.div>
  )
}





