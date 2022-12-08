export const FormatCurrency = (params) => {
  const resultAfterFormating = Number(params).toLocaleString('en-ID', {
    style: 'currency',
    currency: 'IDR',
  });
  return resultAfterFormating;
};
