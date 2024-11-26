import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState(["", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // Handle email submission (Step 1)
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost/mypass/validate_email.php", { email });
            if (response.data.success) {
                setQuestions(response.data.questions);
                setStep(2); // Move to Step 2
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
            console.error(error);
        }
    };

    // Handle answers submission (Step 2)
    const handleAnswersSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost/mypass/validate_answers.php",
                { email, answers },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            if (response.data.success) {
                setStep(3); // Move to Step 3
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
            console.error(error);
        }
    };

    // Handle password reset (Step 3)
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }
        try {
            const response = await axios.post("http://localhost/mypass/reset_password.php", {
                email,
                new_password: newPassword,
            });
            if (response.data.success) {
                alert("Password reset successfully!");
                navigate("/login"); // Redirect to login page
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
            console.error(error);
        }
    };

    // Handle answer input change
    const handleAnswerChange = (index, value) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = value;
        setAnswers(updatedAnswers);
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            {message && <p style={{ color: "red" }}>{message}</p>}
            {step === 1 && (
                <form onSubmit={handleEmailSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email"
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
                                placeholder={`Answer ${index + 1}`}
                                value={answers[index]}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                required
                            />
                        </div>
                    ))}
                    <button type="submit">Next</button>
                </form>
            )}
            {step === 3 && (
                <form onSubmit={handlePasswordReset}>
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm new password"
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
