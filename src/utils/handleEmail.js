export function handleEmail(email) {
  if(!email || !email.includes('@')) {
    return {
      id: email || '',
      domain: 'naver.com'
    };
  }
  const [id, ...rest] = email.split('@');
  return {
    id,
    domain: rest.join('@')
  };
}