export const getLocalTahunAngkatan = () => {
  const result = [];
  const date = new Date();
  // eslint-disable-next-line for-direction
  for (let index = 2; index >= 1; index -= 1) {
    result.push(date.getFullYear() - index);
  }
  result.push(date.getFullYear());

  for (let index = 1; index < 3; index += 1) {
    result.push(date.getFullYear() + index);
  }
  return result;
};
