export function validateDate(
  day: string,
  month: string,
  year: string
): { error?: string; parsed?: { d: number; m: number; y: number } } {
  const d = parseInt(day, 10);
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);

  if (isNaN(d) || d < 1 || d > 31) {
    return { error: "Invalid day (1-31)" };
  }

  if (isNaN(m) || m < 1 || m > 12) {
    return { error: "Invalid month (1-12)" };
  }

  const now = new Date();
  const currentYear = now.getFullYear();

  if (isNaN(y) || y > currentYear) {
    return { error: "Invalid year (greater than current year)" };
  }

  const birthDate = new Date(y, m - 1, d);
  if (birthDate.getDate() !== d || birthDate.getMonth() !== m - 1 || birthDate.getFullYear() !== y) {
    return { error: "Invalid date" };
  }

  return { parsed: { d, m, y } };
}

export function calculateAge(birthDate: Date): {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = new Date();
  const diff = new Date(now.getTime() - birthDate.getTime());

  return {
    years: diff.getUTCFullYear() - 1970,
    months: diff.getUTCMonth(),
    days: diff.getUTCDate() - 1,
    hours: diff.getUTCHours(),
    minutes: diff.getUTCMinutes(),
    seconds: diff.getUTCSeconds(),
  };
}
