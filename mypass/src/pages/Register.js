import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import React Router's navigation hook

const Register = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        securityQuestions: ["", "", ""],
        securityAnswers: ["", "", ""],
    });

    const [passwordStrength, setPasswordStrength] = useState(""); // For weak password warning
    const [showPassword, setShowPassword] = useState(false); // For password visibility toggle
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // For confirm password visibility toggle
    const navigate = useNavigate(); // React Router navigation hook

    const generatePassword = () => {
        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowercase = "abcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        const specialChars = "!@#$%^&*()";
        const allChars = uppercase + lowercase + numbers + specialChars;

        let password = "";

        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += specialChars[Math.floor(Math.random() * specialChars.length)];

        for (let i = password.length; i < 12; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }

        password = password.split('').sort(() => 0.5 - Math.random()).join('');

        setFormData({ ...formData, password, confirmPassword: password });
        checkPasswordStrength(password);
    };

    const checkPasswordStrength = (password) => {
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()]/.test(password);
        const isLongEnough = password.length >= 8;

        if (!isLongEnough) {
            setPasswordStrength("Password must be at least 8 characters long.");
        } else if (!hasUppercase) {
            setPasswordStrength("Password must contain at least one uppercase letter.");
        } else if (!hasNumber) {
            setPasswordStrength("Password must contain at least one number.");
        } else if (!hasSpecialChar) {
            setPasswordStrength("Password must contain at least one special character.");
        } else {
            setPasswordStrength("Strong password!");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "password") {
            checkPasswordStrength(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (passwordStrength !== "Strong password!") {
            alert("Please use a strong password before registering.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost/mypass/register.php",
                formData
            );
            alert(response.data.message);

            // Reset the form and navigate to login
            setFormData({
                email: "",
                password: "",
                confirmPassword: "",
                securityQuestions: ["", "", ""],
                securityAnswers: ["", "", ""],
            });
            navigate("/login"); // Redirect to login page
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            alert("Registration failed: " + (error.response?.data?.error || error.message));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />

            {/* Password Field */}
            <div style={{ position: "relative" }}>
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button
                    type="button"
                    style={{ position: "absolute", right: "10px", top: "5px" }}
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? "Hide" : "Show"}
                </button>
            </div>

            {/* Confirm Password Field */}
            <div style={{ position: "relative" }}>
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
                <button
                    type="button"
                    style={{ position: "absolute", right: "10px", top: "5px" }}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    {showConfirmPassword ? "Hide" : "Show"}
                </button>
            </div>

            {/* Password Strength Warning */}
            <p>{passwordStrength}</p>

            {/* Generate Password Button */}
            <button type="button" onClick={generatePassword}>
                Generate Strong Password
            </button>

            <h3>Security Questions</h3>
            {formData.securityQuestions.map((question, index) => (
                <div key={index}>
                    <input
                        type="text"
                        placeholder={`Security Question ${index + 1}`}
                        value={question}
                        onChange={(e) => {
                            const updatedQuestions = [...formData.securityQuestions];
                            updatedQuestions[index] = e.target.value;
                            setFormData({ ...formData, securityQuestions: updatedQuestions });
                        }}
                        required
                    />
                    <input
                        type="text"
                        placeholder={`Answer ${index + 1}`}
                        value={formData.securityAnswers[index]}
                        onChange={(e) => {
                            const updatedAnswers = [...formData.securityAnswers];
                            updatedAnswers[index] = e.target.value;
                            setFormData({ ...formData, securityAnswers: updatedAnswers });
                        }}
                        required
                    />
                </div>
            ))}

            <button type="submit">Register</button>

            {/* Go to Login Button */}
            <button type="button" onClick={() => navigate("/login")}>
                Go to Login
            </button>
        </form>
    );
};

export default Register;
