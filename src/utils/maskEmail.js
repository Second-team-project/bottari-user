/**
 * 이메일 마스킹
 * @param {*} email 
 * @returns 12**@*.*
 */
export const maskEmail = (email) => {
  if(!email) return '익명 사용자';

  const [id] = email.split('@')
  const maskedId = id.substring(0, 2) + '**';

  return `${maskedId}@*.*`
}