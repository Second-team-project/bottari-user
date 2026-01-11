import "./FAQItem.css";

import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQItem({ faq, isOpen, onToggle }) {



  return (

    <div className="faq-item">
      <div className="faq-question" onClick={onToggle}>
        <span><span className="faq-category">{faq.category}</span>{faq.title}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      {isOpen && (
        <div className="faq-answer">
          {
            faq.img && (
              <div className="faq-image-wrapper">
                <img className="faq-image" src={faq.img} alt="FAQ 이미지" />
              </div>
            )
          }
          A. {faq.content}
        </div>
      )}
    </div>
      
  );
};