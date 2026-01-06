import { useNavigate } from "react-router-dom"
import { MessageCircle } from 'lucide-react'
import './LiveChatBtn.css'

export default function LiveChatBtn() {
  // ===== hooks
  const navigate = useNavigate()

  // ===== handler
  const handleClick = () => {
    navigate('/chat')
  }

  return(
    <button className="live-chat-btn" onClick={handleClick}>
      <MessageCircle size={24} />
      <span>상담하기</span>
    </button>
  )
}