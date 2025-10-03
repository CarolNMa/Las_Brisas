// Utility functions for form validations

/**
 * Validates if a person is at least 18 years old based on birthdate
 * @param {string} birthdate - Date string in YYYY-MM-DD format
 * @returns {boolean} - True if 18 or older, false otherwise
 */
export const isAdult = (birthdate) => {
    if (!birthdate) return false;

    const birthDate = new Date(birthdate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;

    return actualAge >= 18;
};

/**
 * Validates email format
 * @param {string} email - Email string to validate
 * @returns {boolean} - True if valid email format, false otherwise
 */
export const isValidEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validates phone number format (allows international format)
 * @param {string} phone - Phone number string to validate
 * @returns {boolean} - True if valid phone format, false otherwise
 */
export const isValidPhone = (phone) => {
    if (!phone) return false;
    const phoneRegex = /^\+?[0-9\s\-\(\)]{7,15}$/;
    return phoneRegex.test(phone);
};

/**
 * Validates URL format (specifically for video URLs)
 * @param {string} url - URL string to validate
 * @returns {boolean} - True if valid URL format, false otherwise
 */
export const isValidUrl = (url) => {
    if (!url || url.trim() === "") return true; // Optional field
    const urlRegex = /^https?:\/\/.+/;
    return urlRegex.test(url);
};

/**
 * Validates date range (start date before end date)
 * @param {string} startDate - Start date string
 * @param {string} endDate - End date string
 * @returns {boolean} - True if start is before end, false otherwise
 */
export const isValidDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return true; // Let required validation handle this
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start < end;
};

/**
 * Validates that start date is not in the past
 * @param {string} startDate - Start date string
 * @returns {boolean} - True if start date is today or future, false otherwise
 */
export const isStartDateValid = (startDate) => {
    if (!startDate) return true; // Let required validation handle this
    const start = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return start >= today;
};

/**
 * Validates minimum length for text fields
 * @param {string} text - Text to validate
 * @param {number} minLength - Minimum required length
 * @returns {boolean} - True if text meets minimum length, false otherwise
 */
export const hasMinimumLength = (text, minLength = 1) => {
    if (!text) return false;
    return text.trim().length >= minLength;
};

/**
 * Validates document number format (basic alphanumeric check)
 * @param {string} document - Document number to validate
 * @param {number} minLength - Minimum length required
 * @returns {boolean} - True if valid document format, false otherwise
 */
export const isValidDocument = (document, minLength = 5) => {
    if (!document) return false;
    return document.trim().length >= minLength && /^[a-zA-Z0-9]+$/.test(document.replace(/\s/g, ''));
};

/**
 * Comprehensive form validation function
 * @param {object} formData - Form data object
 * @param {object} validationRules - Validation rules object
 * @returns {object} - Object with isValid boolean and errors object
 */
export const validateForm = (formData, validationRules) => {
    const errors = {};

    Object.keys(validationRules).forEach(field => {
        const rules = validationRules[field];
        const value = formData[field];

        if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
            errors[field] = rules.requiredMessage || `${field} es obligatorio.`;
        } else if (value && typeof value === 'string') {
            if (rules.minLength && value.trim().length < rules.minLength) {
                errors[field] = rules.minLengthMessage || `${field} debe tener al menos ${rules.minLength} caracteres.`;
            }
            if (rules.pattern && !rules.pattern.test(value)) {
                errors[field] = rules.patternMessage || `${field} tiene un formato inválido.`;
            }
        }

        // Custom validation functions
        if (rules.custom && typeof rules.custom === 'function') {
            const customError = rules.custom(value, formData);
            if (customError) {
                errors[field] = customError;
            }
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};