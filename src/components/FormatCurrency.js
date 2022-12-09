export const FormatCurrency = (params) => {
  const resultAfterFormating = Number(params).toLocaleString('en-ID', {
    style: 'currency',
    currency: 'IDR',
  });
  const toRp = resultAfterFormating.replace('IDR', 'Rp');
  return toRp;
};
