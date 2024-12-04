class UIController {
    constructor() {
        this.components = {};
    }

    register(componentName, component) {
        this.components[componentName] = component;
    }

    notify(sender, event, data) {
        switch (event) {
            case "USER_LOGGED_IN":
                this.components["Vault"]?.onUserLogin(data);
                break;
            case "PASSWORD_RESET":
                this.components["Notifications"]?.addNotification("Password successfully reset!");
                break;
            case "REGISTER_SUCCESS":
                this.components["Notifications"]?.addNotification("Registration successful!");
                this.components["Login"]?.redirectToLogin();
                break;
            default:
                console.warn(`Unhandled event: ${event}`);
        }
    }
}

const uiController = new UIController();
export default uiController;
