import axios from "axios";

// Base class for Chain of Responsibility (COR) pattern
class CORHandler {
    constructor(nextHandler = null) {
        this.nextHandler = nextHandler; // Reference to the next handler in the chain
    }

    // Method to handle the request, passes it to the next handler if applicable
    handle(request) {
        if (this.nextHandler) {
            return this.nextHandler.handle(request);  // Pass request to the next handler
        }
        return null;  // Return null if no handler is found
    }
}

// Step 1: Email Validation Handler
class EmailValidationHandler extends CORHandler {
    async handle(request) {
        if (request.action === "validate_email") {
            try {
                // Send the email validation request to the backend
                const response = await axios.post("http://localhost/mypass/forgot_password.php", {
                    action: "validate_email",
                    email: request.email,
                });

                // Handle the response
                if (response.data.success) {
                    return {
                        success: true,
                        questions: response.data.questions,  // Return the list of security questions
                    };
                } else {
                    return {
                        success: false,
                        message: response.data.message,  // Return the error message
                    };
                }
            } catch (error) {
                console.error("Error validating email:", error);
                return {
                    success: false,
                    message: "An error occurred. Please try again.",
                };
            }
        }
        return super.handle(request);  // Pass to the next handler if not for email validation
    }
}

// Step 2: Security Answer Validation Handler
class SecurityAnswerValidationHandler extends CORHandler {
    async handle(request) {
        if (request.action === "validate_answers") {
            try {
                // Send the security answer validation request to the backend
                const response = await axios.post("http://localhost/mypass/forgot_password.php", {
                    action: "validate_answers",
                    email: request.email,
                    answers: request.answers,
                });

                // Handle the response
                if (response.data.success) {
                    return { success: true };  // Validation successful
                } else {
                    return {
                        success: false,
                        message: response.data.message,  // Return the error message
                    };
                }
            } catch (error) {
                console.error("Error validating answers:", error);
                return {
                    success: false,
                    message: "An error occurred. Please try again.",
                };
            }
        }
        return super.handle(request);  // Pass to the next handler if not for security answers
    }
}

// Step 3: Password Update Handler
class PasswordUpdateHandler extends CORHandler {
    async handle(request) {
        if (request.action === "update_password") {
            try {
                // Send the password update request to the backend
                const response = await axios.post("http://localhost/mypass/forgot_password.php", {
                    action: "update_password",
                    email: request.email,
                    newPassword: request.newPassword,
                });

                // Handle the response
                if (response.data.success) {
                    return {
                        success: true,
                        message: "Password updated successfully. Redirecting to login...",  // Success message
                    };
                } else {
                    return {
                        success: false,
                        message: response.data.message,  // Return the error message
                    };
                }
            } catch (error) {
                console.error("Error updating password:", error);
                return {
                    success: false,
                    message: "An error occurred. Please try again.",
                };
            }
        }
        return super.handle(request);  // Pass to the next handler if not for password update
    }
}

// Exporting handlers to be used in other parts of the application
export { EmailValidationHandler, SecurityAnswerValidationHandler, PasswordUpdateHandler };
