import { useLocation, useNavigate } from "react-router-dom"
import { MessageCircle } from 'lucide-react'
import './LiveChatBtn.css'

export default function LiveChatBtn() {
  // ===== hooks
  const navigate = useNavigate()
  const location = useLocation()
  // ===== handler
  const handleClick = () => {
    navigate('/chat')
  }

  const hiddenPaths = ['/chat', '/login', '/callback/social']
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }
  
  return(
    <button className="live-chat-btn" onClick={handleClick}>
      <MessageCircle size={24} />
      <span className="live-chat-btn-text">상담하기</span>
    </button>
  )
}