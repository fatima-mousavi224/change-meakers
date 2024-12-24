export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '';

  const d = new Date(date);

  // Check if the date is valid
  if (isNaN(d.getTime())) return '';

  // Pad with leading zeros if necessary
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
