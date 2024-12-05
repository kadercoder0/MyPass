class PasswordBuilder {
    constructor() {
        this.password = "";  // Initialize password to an empty string
        this.length = 12;  // Default password length
        this.includeUppercase = true;  // Default includes uppercase letters
        this.includeNumbers = true;  // Default includes numbers
        this.includeSpecialChars = true;  // Default includes special characters
    }

    // Set the length of the password
    setLength(length) {
        this.length = length;
        return this;  // Return the instance to allow method chaining
    }

    // Decide whether to include uppercase letters
    setUppercase(include) {
        this.includeUppercase = include;
        return this;  // Return the instance to allow method chaining
    }

    // Decide whether to include numbers in the password
    setNumbers(include) {
        this.includeNumbers = include;
        return this;  // Return the instance to allow method chaining
    }

    // Decide whether to include special characters
    setSpecialChars(include) {
        this.includeSpecialChars = include;
        return this;  // Return the instance to allow method chaining
    }

    // Generate the password based on the selected criteria
    generate() {
        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";  // Uppercase letters
        const lowercase = "abcdefghijklmnopqrstuvwxyz";  // Lowercase letters
        const numbers = "0123456789";  // Numbers
        const specialChars = "!@#$%^&*()";  // Special characters
        let allChars = lowercase;  // Start with lowercase characters

        // Add characters based on the selected options
        if (this.includeUppercase) allChars += uppercase;
        if (this.includeNumbers) allChars += numbers;
        if (this.includeSpecialChars) allChars += specialChars;

        let password = "";
        // Ensure the password contains at least one of each type of character
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += specialChars[Math.floor(Math.random() * specialChars.length)];

        // Fill the rest of the password with random characters from the selected set
        for (let i = password.length; i < this.length; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }

        // Shuffle the password to ensure randomness
        password = password.split("").sort(() => 0.5 - Math.random()).join("");
        return password;  // Return the generated password
    }
}

export default PasswordBuilder;
