import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DataProxy from "../patterns/DataProxy";  // Import DataProxy to handle sensitive data access
import notifier from "../patterns/Notifier";  // Import Notifier to send alerts
import Notifications from "./Notifications";  // Import Notifications component to display notifications
import SessionManager from "../patterns/SessionManager"; // Manage session data
import './styles.css';

const Vault = () => {
    const [items, setItems] = useState([]);  // Store vault items
    const [formData, setFormData] = useState({ type: "Login", data: {} });  // Form data for creating/editing items
    const [isEditing, setIsEditing] = useState(false);  // Track if user is editing an existing item
    const [editId, setEditId] = useState(null);  // Track the ID of the item being edited
    const [unmaskedFields, setUnmaskedFields] = useState({});  // Keep track of which fields are unmasked
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));  // Get the logged-in user

    const AUTO_LOCK_TIME = 2 * 30 * 1000;  // Set auto-lock time to 2 minutes
    let activityTimeout;

    // Redirect to login if no user is found
    if (!user) {
        navigate("/login");
    }

    // Define the fields for each item type
    const typeFields = {
        Login: ["URL", "Username", "Password"],
        CreditCard: ["Card Type", "Card Number", "Expiry Date", "CVV"],
        Identity: ["Document Type", "Document Number", "Expiry Date"],
        SecureNote: ["Title", "Note"],
    };

    // Define which fields contain sensitive data
    const sensitiveFields = {
        Login: ["Username", "Password"],
        CreditCard: ["Card Number", "Expiry Date", "CVV"],
        SecureNote: ["Note"],
        Identity: ["Document Number", "Expiry Date"],
    };

    // Fetch items from the server and start the inactivity timer
    useEffect(() => {
        fetchItems();
        startInactivityTimer();

        document.addEventListener("mousemove", resetInactivityTimer);
        document.addEventListener("keypress", resetInactivityTimer);
        document.addEventListener("click", resetInactivityTimer);

        return () => {
            clearTimeout(activityTimeout);
            document.removeEventListener("mousemove", resetInactivityTimer);
            document.removeEventListener("keypress", resetInactivityTimer);
            document.removeEventListener("click", resetInactivityTimer);
        };
    }, []);

    // Start the inactivity timer
    const startInactivityTimer = () => {
        activityTimeout = setTimeout(() => {
            handleAutoLock();
        }, AUTO_LOCK_TIME);
    };

    // Reset inactivity timer whenever user interacts with the page
    const resetInactivityTimer = () => {
        clearTimeout(activityTimeout);
        startInactivityTimer();
    };

    // Log the user out due to inactivity
    const handleAutoLock = () => {
        alert("You have been logged out due to inactivity.");
        localStorage.removeItem("user");
        navigate("/login");
    };

    // Fetch vault items from the server
    const fetchItems = async () => {
        try {
            const response = await axios.post("http://localhost/mypass/vault.php", {
                action: "read",
                user_id: user.id,
            });

            if (response.data.success) {
                setItems(response.data.items);
                checkForIssues(response.data.items);  // Check for issues like weak passwords or expired items
            }
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    // Check for issues in items like weak passwords, expired cards, etc.
    const checkForIssues = (items) => {
        items.forEach((item) => {
            const itemData = JSON.parse(item.data);

            // Check for weak passwords in login items
            // Check for weak passwords in login items
            if (item.type === "Login" && itemData.Password) {
                const password = itemData.Password;
                const minLength = 8;
                const hasUpperCase = /[A-Z]/.test(password);
                const hasLowerCase = /[a-z]/.test(password);
                const hasDigits = /\d/.test(password);
                const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

                if (password.length < minLength || !hasUpperCase || !hasLowerCase || !hasDigits || !hasSpecialChars) {
                    notifier.notify(`Weak password detected for login item with URL: ${itemData.URL}`);
                }
            }


            // Check for expired credit cards
            if (item.type === "CreditCard" && itemData["Expiry Date"]) {
                const [month, year] = itemData["Expiry Date"].split("/").map(Number);
                const expiryDate = new Date(year, month - 1);  // Set expiry date
                const currentDate = new Date();
                currentDate.setDate(1);
                currentDate.setHours(0, 0, 0, 0);

                if (expiryDate < currentDate) {
                    notifier.notify(`Credit card has expired: ${itemData["Card Number"]}`);
                }
            }

            // Check for expired identity documents
            if (item.type === "Identity" && itemData["Expiry Date"]) {
                const expiryDate = new Date(itemData["Expiry Date"]);
                const currentDate = new Date();
                if (expiryDate < currentDate) {
                    notifier.notify(`Document has expired: ${itemData["Document Type"]}`);
                }
            }
        });
    };

    // Create or update a vault item
    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        const action = isEditing ? "update" : "create";

        try {
            const response = await axios.post("http://localhost/mypass/vault.php", {
                action,
                user_id: user.id,
                id: editId,
                type: formData.type,
                data: formData.data,
            });

            if (response.data.success) {
                fetchItems();  // Refresh the items after creating/updating
                setFormData({ type: "Login", data: {} });  // Reset form
                setIsEditing(false);
                setEditId(null);
            } else {
                console.error("Update failed:", response.data.message);
            }
        } catch (error) {
            console.error(`Error ${action}ing item:`, error);
        }
    };

    // Delete a vault item
    const handleDelete = async (id) => {
        try {
            const response = await axios.post("http://localhost/mypass/vault.php", {
                action: "delete",
                user_id: user.id,
                id,
            });

            if (response.data.success) {
                fetchItems();  // Refresh the items after deletion
            }
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    // Start editing an existing vault item
    const handleEdit = (item) => {
        setFormData({ type: item.type, data: JSON.parse(item.data) });
        setIsEditing(true);
        setEditId(item.id);
    };

    // Update form data as the user types
    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            data: { ...prev.data, [field]: value },
        }));
    };

    // Copy sensitive data to the clipboard
    const handleCopy = (itemId, field) => {
        const item = items.find(item => item.id === itemId);  // Find the item by ID
        const itemData = JSON.parse(item.data);  // Get the actual data

        const data = itemData[field];  // Get the real value of the field

        navigator.clipboard.writeText(data)
            .then(() => {
                alert(`Copied to clipboard: ${data}`);
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
            });
    };

    // Toggle the visibility of sensitive data fields
    const toggleMask = (itemId, field) => {
        setUnmaskedFields((prev) => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                [field]: !prev[itemId]?.[field],
            },
        }));
    };

    // Check if a field is currently unmasked
    const isUnmasked = (itemId, field) => unmaskedFields[itemId]?.[field];

    return (
        <div>
            <Notifications />  {/* Display notifications */}
            <h2>Vault</h2>
            <button
                onClick={() => {
                    SessionManager.clearSession();  // Clear the session on logout
                    navigate("/login");  // Redirect to login
                }}
                style={{ marginBottom: "20px" }}
            >
                Logout
            </button>

            <form onSubmit={handleCreateOrUpdate}>
                <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                    {Object.keys(typeFields).map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>

                {typeFields[formData.type].map((field) => (
                    <div key={field} style={{ marginBottom: "10px" }}>
                        <label>{field}:</label>
                        <input
                            type="text"
                            value={formData.data[field] || ""}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                            required
                        />
                    </div>
                ))}

                <button type="submit">{isEditing ? "Update" : "Create"} Item</button>
            </form>

            <h3>Items</h3>
            <ul>
                {items.map((item) => {
                    const itemData = JSON.parse(item.data);
                    const dataProxy = new DataProxy(itemData);  // Use DataProxy for accessing item data

                    return (
                        <li key={item.id} style={{ marginBottom: "15px" }}>
                            <strong>{item.type}:</strong>
                            {Object.entries(itemData).map(([key, value]) => {
                                const isSensitive = sensitiveFields[item.type]?.includes(key);

                                if (isSensitive) {
                                    const data = isUnmasked(item.id, key)
                                        ? dataProxy.getData(key)  // Get unmasked data
                                        : "****";  // Mask the data

                                    return (
                                        <div key={key} style={{ display: "flex", alignItems: "center", marginTop: "5px" }}>
                                            <span style={{ marginRight: "10px" }}>
                                                {key}: {data}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => toggleMask(item.id, key)}
                                                style={{ marginLeft: "10px" }}
                                            >
                                                {isUnmasked(item.id, key) ? "Mask" : "Unmask"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(item.id, key)}  // Copy data to clipboard
                                                style={{ marginLeft: "10px" }}
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={key} style={{ marginTop: "5px" }}>
                                        <span>{key}: {value}</span>
                                    </div>
                                );
                            })}

                            <button onClick={() => handleEdit(item)} style={{ marginLeft: "10px" }}>
                                Edit
                            </button>
                            <button onClick={() => handleDelete(item.id)} style={{ marginLeft: "10px" }}>
                                Delete
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Vault;
