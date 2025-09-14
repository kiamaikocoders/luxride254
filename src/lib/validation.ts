export function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validatePhoneKe(value: string): boolean {
  // Accept +2547XXXXXXXX or 07XXXXXXXX
  return /^(\+2547\d{8}|07\d{8})$/.test(value);
}

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}


