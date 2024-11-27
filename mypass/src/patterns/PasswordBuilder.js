class PasswordBuilder {
    constructor() {
        this.uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        this.lowercase = "abcdefghijklmnopqrstuvwxyz";
        this.numbers = "0123456789";
        this.specialChars = "!@#$%^&*()";
        this.allChars = this.uppercase + this.lowercase + this.numbers + this.specialChars;
        this.length = 12; // Default length
    }

    setLength(length) {
        this.length = length;
        return this; // Allows chaining
    }

    includeUppercase() {
        this.uppercaseIncluded = true;
        return this;
    }

    includeLowercase() {
        this.lowercaseIncluded = true;
        return this;
    }

    includeNumbers() {
        this.numbersIncluded = true;
        return this;
    }

    includeSpecialChars() {
        this.specialCharsIncluded = true;
        return this;
    }

    generate() {
        let password = "";

        // Ensure each character type is included at least once
        if (this.uppercaseIncluded) {
            password += this.uppercase[Math.floor(Math.random() * this.uppercase.length)];
        }
        if (this.lowercaseIncluded) {
            password += this.lowercase[Math.floor(Math.random() * this.lowercase.length)];
        }
        if (this.numbersIncluded) {
            password += this.numbers[Math.floor(Math.random() * this.numbers.length)];
        }
        if (this.specialCharsIncluded) {
            password += this.specialChars[Math.floor(Math.random() * this.specialChars.length)];
        }

        // Fill the remaining length with random characters from all allowed characters
        while (password.length < this.length) {
            password += this.allChars[Math.floor(Math.random() * this.allChars.length)];
        }

        // Shuffle the password to ensure randomness
        return password.split('').sort(() => 0.5 - Math.random()).join('');
    }

    static checkStrength(password) {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()]/.test(password);
        const isLongEnough = password.length >= 8;

        if (!isLongEnough) {
            return "Password must be at least 8 characters long.";
        } else if (!hasUppercase) {
            return "Password must contain at least one uppercase letter.";
        } else if (!hasLowercase) {
            return "Password must contain at least one lowercase letter.";
        } else if (!hasNumber) {
            return "Password must contain at least one number.";
        } else if (!hasSpecialChar) {
            return "Password must contain at least one special character.";
        } else {
            return "Strong password!";
        }
    }
}

export default PasswordBuilder;
