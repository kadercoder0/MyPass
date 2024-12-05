class UIController {
    constructor() {
        this.components = {};  // Store registered components by name
    }

    // Register a component by name
    register(componentName, component) {
        this.components[componentName] = component;  // Add the component to the components list
    }

    // Notify registered components of an event
    notify(sender, event, data) {
        // Handle different types of events and notify relevant components
        switch (event) {
            case "USER_LOGGED_IN":
                // If the event is "USER_LOGGED_IN", notify the Vault component
                this.components["Vault"]?.onUserLogin(data);
                break;
            case "PASSWORD_RESET":
                // If the event is "PASSWORD_RESET", notify the Notifications component
                this.components["Notifications"]?.addNotification("Password successfully reset!");
                break;
            case "REGISTER_SUCCESS":
                // If the event is "REGISTER_SUCCESS", notify both Notifications and Login components
                this.components["Notifications"]?.addNotification("Registration successful!");
                this.components["Login"]?.redirectToLogin();
                break;
            default:
                // Warn if the event is unhandled
                console.warn(`Unhandled event: ${event}`);
        }
    }
}

// Create an instance of UIController and export it
const uiController = new UIController();
export default uiController;
