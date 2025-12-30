import "./FAQ.css";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import FAQItem from "./FAQItem.jsx";
import { getFaqThunk } from "../../store/thunks/serviceThunk.js";

export default function FAQ() {
  // ===== hooks
  const dispatch = useDispatch();
  // ===== redux state
  const faqList = useSelector(state => state.service.faqList)
  // ===== local state
  const [openIndex, setOpenIndex] = useState(null);

  // const toggleFaq = (index) => {
  //   setOpenIndex(openIndex === index ? null : index);
  // };

  useEffect(() => {
    dispatch(getFaqThunk())
  }, [])

  return (
    <div className="faq-container">
      {/* FAQ 목록 */}
      <div className="faq-list">




          { faqList?.length > 0 && faqList?.map((faq, index) => (
            <FAQItem 
              key={faq.id}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(index)}
            />
            // <div key={index} className="faq-item">
            //   <div className="faq-question" onClick={() => toggleFaq(index)}>
            //     <span>Q. {faq.question}</span>
            //     {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            //   </div>
            //   {openIndex === index && (
            //     <div className="faq-answer">
            //       A. {faq.answer}
            //     </div>
            //   )}
            // </div>
          ))}



      </div>
    </div>
  );
};