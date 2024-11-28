import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PasswordBuilder from "../patterns/PasswordBuilder"; // Import PasswordBuilder

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState(["", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const checkPasswordStrength = (password) => {
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()]/.test(password);
        const isLongEnough = password.length >= 8;

        if (!isLongEnough) {
            return "Password must be at least 8 characters long.";
        } else if (!hasUppercase) {
            return "Password must contain at least one uppercase letter.";
        } else if (!hasNumber) {
            return "Password must contain at least one number.";
        } else if (!hasSpecialChar) {
            return "Password must contain at least one special character.";
        } else {
            return "Strong password!";
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost/mypass/forgot_password.php", {
                action: "validate_email",
                email,
            });
            if (response.data.success) {
                setQuestions(response.data.questions);
                setStep(2);
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error("Error validating email:", error);
            setMessage("An error occurred. Please try again.");
        }
    };

    const handleAnswersSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost/mypass/forgot_password.php", {
                action: "validate_answers",
                email: email.trim(),
                answers: answers.map((answer) => answer.trim()),
            });
            if (response.data.success) {
                setStep(3);
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error("Error validating answers:", error);
            setMessage("An error occurred. Please try again.");
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        const strengthMessage = checkPasswordStrength(newPassword);

        if (strengthMessage !== "Strong password!") {
            setMessage(strengthMessage);
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post("http://localhost/mypass/forgot_password.php", {
                action: "update_password",
                email,
                newPassword,
            });
            if (response.data.success) {
                setMessage("Password updated successfully. Redirecting to login...");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error("Error updating password:", error);
            setMessage("An error occurred. Please try again.");
        }
    };

    const generateStrongPassword = () => {
        const passwordBuilder = new PasswordBuilder();
        const generatedPassword = passwordBuilder
            .setLength(12)
            .setUppercase(true)
            .setNumbers(true)
            .setSpecialChars(true)
            .generate();

        setNewPassword(generatedPassword);
        setConfirmPassword(generatedPassword);
        setMessage("A strong password has been generated!");
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            {message && <p style={{ color: message === "Strong password!" ? "green" : "red" }}>{message}</p>}

            {step === 1 && (
                <form onSubmit={handleEmailSubmit}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">Next</button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleAnswersSubmit}>
                    {questions.map((question, index) => (
                        <div key={index}>
                            <label>{question}</label>
                            <input
                                type="text"
                                value={answers[index]}
                                onChange={(e) => {
                                    const newAnswers = [...answers];
                                    newAnswers[index] = e.target.value;
                                    setAnswers(newAnswers);
                                }}
                                required
                            />
                        </div>
                    ))}
                    <button type="submit">Next</button>
                </form>
            )}

{step === 3 && (
    <form onSubmit={handlePasswordSubmit}>
        <label>New Password:</label>
        <div style={{ display: "flex", alignItems: "center" }}>
            <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
            />
            <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{ marginLeft: "10px" }}
            >
                {showNewPassword ? "Hide" : "Show"}
            </button>
        </div>
        <label>Confirm New Password:</label>
        <div style={{ display: "flex", alignItems: "center" }}>
            <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
            <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ marginLeft: "10px" }}
            >
                {showConfirmPassword ? "Hide" : "Show"}
            </button>
        </div>
        <button
            type="button"
            onClick={generateStrongPassword}
            style={{ marginTop: "10px" }}
        >
            Generate Strong Password
        </button>
        <button type="submit">Reset Password</button>
    </form>
)}

        </div>
    );
};

export default ForgotPassword;
