import "./FAQ.css";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQ() {
  // TODO: 백엔드에서 FAQ 목록 가져오기
  const [openIndex, setOpenIndex] = useState(null);

  // 임시 데이터
  const faqList = [
    {
      question: "예약은 어떻게 하나요?",
      answer: "홈 화면에서 '예약' 버튼을 눌러 맡기기 또는 옮기기를 선택하시면 됩니다.",
    },
    {
      question: "결제 취소는 어떻게 하나요?",
      answer: "예약 조회에서 해당 예약의 '예약 취소' 버튼을 누르시면 됩니다. 진행 전 상태에서만 취소가 가능합니다.",
    },
    {
      question: "보관 기간은 얼마나 되나요?",
      answer: "최소 1시간부터 최대 7일까지 보관 가능합니다.",
    },
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      {/* FAQ 목록 */}
      <div className="faq-list">
        {faqList.map((faq, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question" onClick={() => toggleFaq(index)}>
              <span>Q. {faq.question}</span>
              {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {openIndex === index && (
              <div className="faq-answer">
                A. {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};