/**
 * @file api/chatApi.js
 * @description 채팅 관련 API
 * 260110 v1.0.0 N init
 */

import axiosIns from './axiosInstance.js';

/**
 * 비회원 채팅 인증 (예약코드 + 비밀번호)
 * @param {{ code: string, password: string }} data
 * @returns {{ accessToken, booker, reservation }}
 */
export const guestAuth = async ({ code, password }) => {
  const url = '/api/chat/guest/auth';

  const response = await axiosIns.post(url, { code, password });

  return response.data.data;
};

/**
 * 채팅방 생성/조회
 * @param {{ bookerId?: number }} data - 비회원인 경우 bookerId 전달
 * @param {string} guestToken - 비회원 액세스 토큰 (선택)
 * @returns {object} room
 */
export const createRoom = async (data = {}, guestToken = null) => {
  const url = '/api/chat/rooms';

  const config = guestToken
    ? { headers: { Authorization: `Bearer ${guestToken}` } }
    : {};

  const response = await axiosIns.post(url, data, config);

  return response.data.data;
};

/**
 * 채팅 메시지 목록 조회
 * @param {number|string} roomId
 * @param {string} guestToken - 비회원 액세스 토큰 (선택)
 * @returns {array} messages
 */
export const getMessages = async (roomId, guestToken = null) => {
  const url = `/api/chat/rooms/${roomId}/messages`;

  const config = guestToken
    ? { headers: { Authorization: `Bearer ${guestToken}` } }
    : {};

  const response = await axiosIns.get(url, config);

  return response.data.data;
};

/**
 * 채팅 이미지 서버 저장 및 경로 반환
 * @param {number|string} roomId
 * @returns {array} messages
 */
export const sendImg = async (data) => {
  const url = `/api/common/files/chat`;

  const response = await axiosIns.post(url, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data.data;
};
