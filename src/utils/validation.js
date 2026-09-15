/**
 * validation.js
 * ---------------------------------------------------------------------------
 * Shared client-side validation + sanitization for every ElexoPlus form.
 *
 * SECURITY NOTE — read this before relying on anything here:
 *   Client-side validation is a UX convenience, NOT a security control.
 *   Anyone can bypass it with devtools or by calling the API directly.
 *   Every rule below MUST also be enforced server-side in the PHP endpoint
 *   (the delivered endpoints already re-validate required fields, email
 *   format and types independently). What this file genuinely provides:
 *     • immediate, friendly feedback so users fix mistakes before submitting
 *     • consistent formatting/normalisation of values before they're sent
 *     • reduced junk traffic hitting the API
 *   It does NOT protect against injection, XSS or forged requests — that's
 *   the server's job via prepared statements and output escaping.
 * ---------------------------------------------------------------------------
 */

export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phoneIN: /^[6-9]\d{9}$/,          // Indian mobile: 10 digits starting 6-9
  pincodeIN: /^[1-9]\d{5}$/,        // 6-digit Indian PIN, can't start with 0
  gstIN: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}$/,
  serial: /^[A-Z0-9][A-Z0-9-]{4,49}$/i,
  name: /^[a-zA-Z\s.'-]{2,100}$/,
};

/**
 * Strips characters that have no business being in a plain text field.
 * This is a normalisation step for cleaner data — NOT an XSS defence.
 * React already escapes rendered values, and the server must escape on
 * output; never treat this as sanitising untrusted HTML.
 */
export function cleanText(value, maxLength = 500) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[<>]/g, '')   // discourage accidental tag-like input
    .replace(/\s+/g, ' ')
    .trimStart()
    .slice(0, maxLength);
}

export function digitsOnly(value, maxLength = 15) {
  return String(value || '').replace(/\D/g, '').slice(0, maxLength);
}

export function upperAlphaNum(value, maxLength = 50) {
  return String(value || '').toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, maxLength);
}

/** Individual field validators — each returns an error string or null. */
export const validators = {
  required: (v, label = 'This field') => (!v || String(v).trim() === '' ? `${label} is required.` : null),

  email: (v) => {
    if (!v || !String(v).trim()) return 'Email address is required.';
    return patterns.email.test(String(v).trim()) ? null : 'Enter a valid email address.';
  },

  phoneIN: (v) => {
    const d = digitsOnly(v, 10);
    if (!d) return 'Phone number is required.';
    if (d.length !== 10) return 'Phone number must be 10 digits.';
    return patterns.phoneIN.test(d) ? null : 'Enter a valid Indian mobile number.';
  },

  pincodeIN: (v) => {
    const d = digitsOnly(v, 6);
    if (!d) return 'Pincode is required.';
    if (d.length !== 6) return 'Pincode must be 6 digits.';
    return patterns.pincodeIN.test(d) ? null : 'Enter a valid Indian pincode.';
  },

  gstIN: (v) => {
    if (!v || !String(v).trim()) return null; // optional field
    return patterns.gstIN.test(String(v).trim().toUpperCase())
      ? null
      : 'Enter a valid 15-character GSTIN.';
  },

  serial: (v) => {
    if (!v || !String(v).trim()) return 'Serial number is required.';
    return patterns.serial.test(String(v).trim())
      ? null
      : 'Serial numbers are 5-50 characters (letters, numbers and dashes).';
  },

  name: (v) => {
    if (!v || !String(v).trim()) return 'Name is required.';
    return patterns.name.test(String(v).trim())
      ? null
      : 'Enter a valid name (letters, spaces, apostrophes and hyphens only).';
  },

  minLength: (v, min, label = 'This field') =>
    String(v || '').trim().length < min ? `${label} must be at least ${min} characters.` : null,

  /** Purchase date must be a real date, not in the future, not absurdly old. */
  pastDate: (v, maxYearsAgo = 15) => {
    if (!v) return 'Date is required.';
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return 'Enter a valid date.';
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (d > today) return 'Date cannot be in the future.';
    const earliest = new Date();
    earliest.setFullYear(earliest.getFullYear() - maxYearsAgo);
    if (d < earliest) return `Date cannot be more than ${maxYearsAgo} years ago.`;
    return null;
  },
};

/**
 * Runs a schema of { fieldName: [validatorFn, ...] } against a form object.
 * Returns { errors, isValid }.
 */
export function validateForm(form, schema) {
  const errors = {};
  for (const [field, rules] of Object.entries(schema)) {
    for (const rule of rules) {
      const err = rule(form[field], form);
      if (err) { errors[field] = err; break; }
    }
  }
  return { errors, isValid: Object.keys(errors).length === 0 };
}

/**
 * Lightweight client-side submit throttle. Prevents double-submits and
 * accidental rapid-fire requests. Again: real rate limiting belongs on the
 * server — this only improves UX and cuts obvious duplicate traffic.
 */
export function createSubmitGuard(minIntervalMs = 2000) {
  let lastSubmit = 0;
  return () => {
    const now = Date.now();
    if (now - lastSubmit < minIntervalMs) return false;
    lastSubmit = now;
    return true;
  };
}
