export default function uniqueId() {
  const characters = '1234567890abcdef';
  const maxLength = 6;
  let result = '';

  for (let i = 0; i < maxLength; i++) {
    const randomNum = Math.floor(Math.random() * characters.length);

    result += characters.charAt(randomNum);
  }

  return result;
}
