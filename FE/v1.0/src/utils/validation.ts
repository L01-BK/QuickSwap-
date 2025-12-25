export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
    // At least 1 uppercase letter and 1 number
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
    return passwordRegex.test(password);
};
