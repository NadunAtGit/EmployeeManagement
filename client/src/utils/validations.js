export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for validating an email address
    return regex.test(email); // Returns true if email matches the regex, otherwise false
};