export default function formatNumberChange(params) {
  const rawData = params?.replace(/,/g, '');
  const cookData = rawData.replace('Rp', '');
  return Number(cookData);
}
