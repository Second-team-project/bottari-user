export function handlePhone(phone) {
  if(!phone || phone.length < 10) {
    return { p1: "010", p2: "", p3: "" };
  }
  return  {
    p1: phone.slice(0, 3),
    p2: phone.slice(3, phone.length - 4),
    p3: phone.slice(-4),
  };
};