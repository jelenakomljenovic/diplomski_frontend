export function generatePassword() {
    const numbers = '0123456789';
    const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const symbols = '!@#$%^&*()_+<>?';

    const password = [
        numbers[Math.floor(Math.random() * numbers.length)],
        upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
    ];

    const allCharacters = numbers + upperCaseLetters + symbols;

    while (password.length < 8) {
        password.push(allCharacters[Math.floor(Math.random() * allCharacters.length)]);
    }

    for (let i = password.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [password[i], password[j]] = [password[j], password[i]];
    }

    return password.join('');
}

export const isValidEmail = (email: string | undefined) => {
    if (email && typeof email === 'string') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    return false;
}