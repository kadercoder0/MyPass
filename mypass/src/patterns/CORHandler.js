// corHandler.js
import axios from "axios";
class CORHandler {
    constructor(nextHandler = null) {
        this.nextHandler = nextHandler;
    }

    handle(request) {
        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }
        return null;
    }
}

// Step 1: Email Validation Handler
class EmailValidationHandler extends CORHandler {
    async handle(request) {
        if (request.action === "validate_email") {
            try {
                const response = await axios.post("http://localhost/mypass/forgot_password.php", {
                    action: "validate_email",
                    email: request.email,
                });
                if (response.data.success) {
                    return {
                        success: true,
                        questions: response.data.questions,
                    };
                } else {
                    return {
                        success: false,
                        message: response.data.message,
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
        return super.handle(request);
    }
}

// Step 2: Security Answer Validation Handler
class SecurityAnswerValidationHandler extends CORHandler {
    async handle(request) {
        if (request.action === "validate_answers") {
            try {
                const response = await axios.post("http://localhost/mypass/forgot_password.php", {
                    action: "validate_answers",
                    email: request.email,
                    answers: request.answers,
                });
                if (response.data.success) {
                    return { success: true };
                } else {
                    return {
                        success: false,
                        message: response.data.message,
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
        return super.handle(request);
    }
}

// Step 3: Password Update Handler
class PasswordUpdateHandler extends CORHandler {
    async handle(request) {
        if (request.action === "update_password") {
            try {
                const response = await axios.post("http://localhost/mypass/forgot_password.php", {
                    action: "update_password",
                    email: request.email,
                    newPassword: request.newPassword,
                });
                if (response.data.success) {
                    return {
                        success: true,
                        message: "Password updated successfully. Redirecting to login...",
                    };
                } else {
                    return {
                        success: false,
                        message: response.data.message,
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
        return super.handle(request);
    }
}

// Exporting handlers
export { EmailValidationHandler, SecurityAnswerValidationHandler, PasswordUpdateHandler };
