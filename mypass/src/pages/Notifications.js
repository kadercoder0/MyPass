// Notifications.js
import React, { useState, useEffect } from "react";
import notifier from "../patterns/Notifier";

const Notifications = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const handleNewNotification = (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);

            // Optionally, remove the notification after 5 seconds
            setTimeout(() => {
                setMessages((prevMessages) => prevMessages.filter((msg) => msg !== message));
            }, 5000);
        };

        // Subscribe to the notifier for new messages
        notifier.subscribe(handleNewNotification);

        // Cleanup the subscription when the component unmounts
        return () => {
            notifier.unsubscribe(handleNewNotification);
        };
    }, []);

    return (
        <div style={{ position: "fixed", top: 0, right: 0, zIndex: 1000 }}>
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
