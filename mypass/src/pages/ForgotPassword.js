import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Enter Email, 2: Answer Questions, 3: Reset Password
    const [email, setEmail] = useState("");
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState(["", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost/mypass/forgot_password.php", {
                action: "validate_email",
                email,
            });
            if (response.data.success) {
                setQuestions(response.data.questions);
                setStep(2); // Move to Step 2
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
            // Trim the answers before sending
            const trimmedAnswers = answers.map((answer) => answer.trim());
    
            const response = await axios.post("http://localhost/mypass/forgot_password.php", {
                action: "validate_answers",
                email: email.trim(),
                answers: trimmedAnswers,
            });
            if (response.data.success) {
                setStep(3); // Move to Step 3
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
                setMessage("Password updated successfully. Please log in.");
                setStep(1); // Reset to Step 1
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error("Error updating password:", error);
            setMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            {message && <p style={{ color: "red" }}>{message}</p>}

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
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <label>Confirm New Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Reset Password</button>
                </form>
            )}
        </div>
    );
};

export default ForgotPassword;
