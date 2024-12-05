class Notifier {
    constructor() {
        this.observers = [];  // List to store the registered observer functions
    }

    // Subscribe an observer (adds it to the observers list)
    subscribe(observer) {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);  // Add observer only if it's not already subscribed
        }
    }

    // Unsubscribe an observer (removes it from the observers list)
    unsubscribe(observer) {
        // Filter out the observer from the list
        this.observers = this.observers.filter((obs) => obs !== observer);
    }

    // Notify all subscribed observers with a message
    notify(message) {
        // Iterate over each observer and call it with the message
        this.observers.forEach((observer) => observer(message));
    }
}

// Create an instance of the Notifier
const notifier = new Notifier();
export default notifier;
