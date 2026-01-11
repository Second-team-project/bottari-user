import "./FAQ.css";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import FAQItem from "./FAQItem.jsx";
import { getFaqThunk } from "../../store/thunks/serviceThunk.js";

export default function FAQ() {
  // ===== hooks
  const dispatch = useDispatch();
  // ===== redux state
  const { faqList, faqListCount } = useSelector(state => state.service)
  // ===== local state
  const [openIndex, setOpenIndex] = useState(null);
  const [page, setPage] = useState(1);

  console.log('faqList.length / faqListCount: ', faqList.length, faqListCount)

  // 첫 호출 : 마운트
  useEffect(() => {
    dispatch(getFaqThunk())
  }, [])

  // === 더보기 호출
  const loadMore = async () => {
    const nextPage = page + 1;
    await dispatch(getFaqThunk(nextPage));
    setPage(nextPage);
  }

  return (
    <div className="faq-container">
      {/* FAQ 목록 */}
      <div className="faq-list">
        { faqList?.length > 0 && faqList?.map((faq, index) => (
          <FAQItem 
            key={faq.id}
            faq={faq}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
        {
          faqList?.length < faqListCount && (
            <div className="service-more-btn-wrapper">
              <button type="button" className="service-more-btn"
                onClick={loadMore}
              >더 보기</button>
            </div>
          )
        }
      </div>
    </div>
  );
};