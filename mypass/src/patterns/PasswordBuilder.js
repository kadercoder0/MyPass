class PasswordBuilder {
    constructor() {
        this.password = "";
        this.length = 12; // Default length
        this.includeUppercase = true;
        this.includeNumbers = true;
        this.includeSpecialChars = true;
    }

    setLength(length) {
        this.length = length;
        return this; // Allow chaining
    }

    setUppercase(include) {
        this.includeUppercase = include;
        return this; // Allow chaining
    }

    setNumbers(include) {
        this.includeNumbers = include;
        return this; // Allow chaining
    }

    setSpecialChars(include) {
        this.includeSpecialChars = include;
        return this; // Allow chaining
    }

    generate() {
        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowercase = "abcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        const specialChars = "!@#$%^&*()";
        let allChars = lowercase; // Start with lowercase

        if (this.includeUppercase) allChars += uppercase;
        if (this.includeNumbers) allChars += numbers;
        if (this.includeSpecialChars) allChars += specialChars;

        let password = "";
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += specialChars[Math.floor(Math.random() * specialChars.length)];

        for (let i = password.length; i < this.length; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }

        password = password.split("").sort(() => 0.5 - Math.random()).join("");
        return password;
    }

}

export default PasswordBuilder;
