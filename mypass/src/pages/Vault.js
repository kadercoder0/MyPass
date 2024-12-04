import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DataProxy from "../patterns/DataProxy";  // Import the DataProxy class
import notifier from "../patterns/Notifier";  // Import the Notifier
import Notifications from "./Notifications";  // Import the Notifications component
import SessionManager from "../patterns/SessionManager"; // Adjust path as necessary


const Vault = () => {
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({ type: "Login", data: {} });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [unmaskedFields, setUnmaskedFields] = useState({});  // Tracks which fields are unmasked
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const AUTO_LOCK_TIME = 2 * 30 * 1000; // 2 minutes in milliseconds
    let activityTimeout;

    if (!user) {
        navigate("/login");
    }

    const typeFields = {
        Login: ["URL", "Username", "Password"],
        CreditCard: ["Card Type", "Card Number", "Expiry Date", "CVV"],
        Identity: ["Document Type", "Document Number", "Expiry Date"],
        SecureNote: ["Title", "Note"],
    };

    const sensitiveFields = {
        Login: ["Username", "Password"],
        CreditCard: ["Card Number", "Expiry Date", "CVV"],
        SecureNote: ["Note"],
        Identity: ["Document Number", "Expiry Date"],
    };

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

    const startInactivityTimer = () => {
        activityTimeout = setTimeout(() => {
            handleAutoLock();
        }, AUTO_LOCK_TIME);
    };

    const resetInactivityTimer = () => {
        clearTimeout(activityTimeout);
        startInactivityTimer();
    };

    const handleAutoLock = () => {
        alert("You have been logged out due to inactivity.");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const fetchItems = async () => {
        try {
            const response = await axios.post("http://localhost/mypass/vault.php", {
                action: "read",
                user_id: user.id,
            });

            if (response.data.success) {
                setItems(response.data.items);
                checkForIssues(response.data.items);  // Check for weak passwords or expired items
            }
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const checkForIssues = (items) => {
        items.forEach((item) => {
            const itemData = JSON.parse(item.data);

            // Check for weak passwords
            if (item.type === "Login" && itemData.Password) {
                if (itemData.Password.length < 8 || !/[A-Z]/.test(itemData.Password) || !/\d/.test(itemData.Password)) {
                    notifier.notify(`Weak password detected for login item with URL: ${itemData.URL}`);
                }
            }

            // Check for credit card expiration
            if (item.type === "CreditCard" && itemData["Expiry Date"]) {
                const [month, year] = itemData["Expiry Date"].split("/").map(Number); // Split MM/YYYY
                const expiryDate = new Date(year, month - 1); // Create a Date object with the month (0-based index)
                const currentDate = new Date();
                
                // Set currentDate to the start of the next month to ensure valid comparisons
                currentDate.setDate(1); 
                currentDate.setHours(0, 0, 0, 0);

                if (expiryDate < currentDate) {
                    notifier.notify(`Credit card has expired: ${itemData["Card Number"]}`);
                }
            }

            // Check for identity document expiration
            if (item.type === "Identity" && itemData["Expiry Date"]) {
                const expiryDate = new Date(itemData["Expiry Date"]);
                const currentDate = new Date();
                if (expiryDate < currentDate) {
                    notifier.notify(`Document has expired: ${itemData["Document Type"]}`);
                }
            }
        });
    };

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
                fetchItems();
                setFormData({ type: "Login", data: {} });
                setIsEditing(false);
                setEditId(null);
            } else {
                console.error("Update failed:", response.data.message);
            }
        } catch (error) {
            console.error(`Error ${action}ing item:`, error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.post("http://localhost/mypass/vault.php", {
                action: "delete",
                user_id: user.id,
                id,
            });

            if (response.data.success) {
                fetchItems();
            }
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    const handleEdit = (item) => {
        setFormData({ type: item.type, data: JSON.parse(item.data) });
        setIsEditing(true);
        setEditId(item.id);
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            data: { ...prev.data, [field]: value },
        }));
    };

    const handleCopy = (itemId, field) => {
        const item = items.find(item => item.id === itemId); // Find the item by ID
        const itemData = JSON.parse(item.data); // Parse the data field to access the original data
    
        const data = itemData[field]; // Get the real value of the field, not the masked one
    
        navigator.clipboard.writeText(data)
            .then(() => {
                alert(`Copied to clipboard: ${data}`);
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
            });
    };
    
    

    const toggleMask = (itemId, field) => {
        setUnmaskedFields((prev) => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                [field]: !prev[itemId]?.[field],
            },
        }));
    };

    const isUnmasked = (itemId, field) => unmaskedFields[itemId]?.[field];

    return (
        <div>
            <Notifications /> {/* Add Notifications component here */}
            <h2>Vault</h2>
            <button
                onClick={() => {
                    SessionManager.clearSession(); // Clear user session
                    navigate("/login");  // Redirect to login page
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
    const dataProxy = new DataProxy(itemData); // Instantiate the proxy

    return (
        <li key={item.id} style={{ marginBottom: "15px" }}>
            <strong>{item.type}:</strong>
            {Object.entries(itemData).map(([key, value]) => {
                const isSensitive = sensitiveFields[item.type]?.includes(key);

                if (isSensitive) {
                    // Mask or unmask the data based on the state
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
                                onClick={() => handleCopy(item.id, key)}  // Pass itemId and field name to copy
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
