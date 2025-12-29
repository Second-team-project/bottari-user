import "./FAQItem.css";

import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQItem({ faq, isOpen, onToggle }) {



  return (

    <div className="faq-item">
      <div className="faq-question" onClick={onToggle}>
        <span>Q. {faq.title}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      {isOpen && (
        <div className="faq-answer">
          A. {faq.content}
        </div>
      )}
    </div>
      
  );
};