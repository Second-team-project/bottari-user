export function handleEmail(email) {
  if(!email || !email.includes('@')) {
    return {
      id: email || '',
      domain: ''
    };
  }
  const [id, ...rest] = email.split('@');
  return {
    id,
    domain: rest.join('@')
  };
}