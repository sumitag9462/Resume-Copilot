// utils/validationHelper.js — STRICT INPUT VALIDATION UTILITY
//
// Protects routes from prototype poisoning, object injection, non-string inputs,
// and unbounded payloads before expensive AI service invocations.

const mongoose = require('mongoose');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Checks if a value is a valid string with optional min/max length bounds.
 */
const isSafeString = (val, minLen = 1, maxLen = 100000) => {
  if (typeof val !== 'string') return false;
  const trimmed = val.trim();
  return trimmed.length >= minLen && trimmed.length <= maxLen;
};

/**
 * Returns trimmed string or empty string if not a string (prevents .trim() crashes on objects).
 */
const safeTrim = (val) => {
  return typeof val === 'string' ? val.trim() : '';
};

/**
 * Validates email format and bounds length.
 */
const isValidEmail = (email) => {
  if (typeof email !== 'string') return false;
  const trimmed = email.trim();
  return trimmed.length <= 120 && EMAIL_REGEX.test(trimmed);
};

/**
 * Validates a MongoDB ObjectId string.
 */
const isValidObjectId = (id) => {
  return typeof id === 'string' && mongoose.Types.ObjectId.isValid(id);
};

/**
 * Validates an array of strings with bounded length.
 */
const validateArrayOfStrings = (arr, minItems = 1, maxItems = 25, minItemLen = 1, maxItemLen = 1000) => {
  if (!Array.isArray(arr)) return { valid: false, message: 'Expected an array.' };
  if (arr.length < minItems) return { valid: false, message: `Array must contain at least ${minItems} item(s).` };
  if (arr.length > maxItems) return { valid: false, message: `Array exceeds maximum limit of ${maxItems} items.` };

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (typeof item !== 'string') {
      return { valid: false, message: `Item at index ${i} must be a string.` };
    }
    const trimmed = item.trim();
    if (trimmed.length < minItemLen || trimmed.length > maxItemLen) {
      return { valid: false, message: `Item at index ${i} length must be between ${minItemLen} and ${maxItemLen} characters.` };
    }
  }

  return { valid: true };
};

module.exports = {
  isSafeString,
  safeTrim,
  isValidEmail,
  isValidObjectId,
  validateArrayOfStrings,
};

