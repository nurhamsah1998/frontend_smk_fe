export const textEllipsis = (str, limit = 100) => {
  if (typeof str !== 'string') str = '';
  return `${str.substring(0, limit)}${str?.length > limit ? '. . .' : ''}`;
};
