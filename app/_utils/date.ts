export function formatPeriod(fromDate: string, toDate: string): string {
  try {
    const from = new Date(fromDate);
    const to = new Date(toDate);

    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const fromStr = from.toLocaleDateString(undefined, options);
    const toStr = to.toLocaleDateString(undefined, options);

    return `${fromStr} - ${toStr}`;
  } catch (e) {
    console.warn('formatPeriod failed', e);
    return `${fromDate} - ${toDate}`;
  }
}
