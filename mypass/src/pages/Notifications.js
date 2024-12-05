import React, { useState, useEffect } from "react";
import notifier from "../patterns/Notifier";
import uiController from "../patterns/UIController";

const Notifications = () => {
    // State to store incoming notification messages
    const [messages, setMessages] = useState([]);
    // State to store already displayed notifications (in memory)
    const [shownMessages, setShownMessages] = useState(new Set());

    useEffect(() => {
        // Handler for new notifications
        const handleNewNotification = (message) => {
            // Check if the notification has been displayed already
            if (!shownMessages.has(message)) {
                // If not, add it to the messages and to the shown messages set
                setMessages((prevMessages) => [...prevMessages, message]);
                setShownMessages((prevShownMessages) => new Set(prevShownMessages.add(message)));
            }
        };

        // Subscribe to the notifier for new messages
        notifier.subscribe(handleNewNotification);

        // Register a UI controller for adding notifications
        uiController.register("Notifications", {
            addNotification: (message) => {
                // Only add the notification if it hasn't been displayed before
                if (!shownMessages.has(message)) {
                    setMessages((prevMessages) => [...prevMessages, message]);
                    setShownMessages((prevShownMessages) => new Set(prevShownMessages.add(message)));
                }
            },
        });

        // Cleanup subscription when the component is unmounted
        return () => {
            notifier.unsubscribe(handleNewNotification);
            uiController.register("Notifications", null);
        };
    }, [shownMessages]);

    return (
        <div style={{ position: "fixed", top: 0, right: 0, zIndex: 1000 }}>
            {/* Display each notification message */}
            {messages.map((message, index) => (
                <div
                    key={index}
                    style={{
                        backgroundColor: "red",
                        color: "white",
                        padding: "10px",
                        margin: "5px",
                        borderRadius: "5px",
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    {message}
                </div>
            ))}
        </div>
    );
};

export default Notifications;
