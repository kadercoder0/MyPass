// Notifier.js
class Notifier {
    constructor() {
        this.observers = []; // List of observer components
    }

    // Register an observer
    // Notifier.js
    subscribe(observer) {
    if (!this.observers.includes(observer)) {
        this.observers.push(observer);
    }}


    // Unsubscribe an observer
    unsubscribe(observer) {
        this.observers = this.observers.filter((obs) => obs !== observer);
    }

    // Notify all registered observers
    notify(message) {
        this.observers.forEach((observer) => observer(message));
    }
}

const notifier = new Notifier();
export default notifier;
