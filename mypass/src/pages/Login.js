import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SessionManager from "../patterns/SessionManager";
import uiController from "../patterns/UIController";

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        uiController.register("Login", {
            redirectToLogin: () => navigate("/login"),
        });
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost/mypass/login.php", credentials);
            if (response.data.success) {
                SessionManager.setUser(response.data.user);
                uiController.notify("Login", "USER_LOGGED_IN", response.data.user);
                navigate("/vault");
            } else {
                setErrorMessage(response.data.message || "Login failed. Please try again.");
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again later.");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                <div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Login</button>
                <button type="button" onClick={() => navigate("/register")}>
                    Go to Register
                </button>
            </form>
            <div style={{ marginTop: "20px" }}>
                <p>
                    Forgot your password?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        style={{
                            background: "none",
                            border: "none",
                            color: "blue",
                            textDecoration: "underline",
                            cursor: "pointer",
                        }}
                    >
                        Recover it here
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
