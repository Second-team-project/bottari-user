import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // host: '0.0.0.0', // TODO 모바일 테스트용
    // port: 5173,      // TODO 모바일 테스트용
    proxy: {
      '/api' : {
        target: 'http://localhost:3000',
        changeOrigin: true,              // Request Header Host 필드 값을 대상 서버 호스트로 변경
        secure: false,                   // SSL 인증서 검증 무시
        ws: true                         // WebSoket 프로토콜 사용
      }
    }
  }
})

