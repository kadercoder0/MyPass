import React from "react";

const Vault = () => {
    const user = JSON.parse(localStorage.getItem("user")); // Retrieve user session

    return (
        <div>
            <h2>Welcome, {user?.email || "User"}!</h2>
            <p>This is your secure vault. Implement vault features here.</p>
        </div>
    );
};

export default Vault;
