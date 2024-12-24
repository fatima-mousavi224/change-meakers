export function formatDateToISOString(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00Z`);

  return date.toISOString();
}
