export const PHONE_REGEX = /^08\d{8,11}$/;


export const isValidPhone = (phone) => {
    return PHONE_REGEX.test(phone);
};


export const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
