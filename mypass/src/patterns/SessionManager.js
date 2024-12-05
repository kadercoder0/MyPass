class SessionManager {
  static instance;  // To store the singleton instance

  // Private constructor to prevent instantiation from outside
  constructor() {
      if (SessionManager.instance) {
          return SessionManager.instance;  // Return the existing instance if it exists
      }

      // Initialize properties
      this.user = null;  // User data (initially null)
      this.sessionKey = 'user';  // Key to store user data in localStorage

      // Set the instance to the current one
      SessionManager.instance = this;
  }

  // Method to set user data in localStorage
  setUser(user) {
      this.user = user;  // Set the user data
      localStorage.setItem(this.sessionKey, JSON.stringify(user));  // Store user data in localStorage
  }

  // Method to get user data from localStorage
  getUser() {
      // If user data isn't already set, fetch it from localStorage
      if (!this.user) {
          this.user = JSON.parse(localStorage.getItem(this.sessionKey));
      }
      return this.user;  // Return the user data
  }

  // Method to clear the session (log the user out)
  clearSession() {
      this.user = null;  // Reset the user data
      localStorage.removeItem(this.sessionKey);  // Remove user data from localStorage
  }
}

// Create and export a single instance of SessionManager
export default new SessionManager();
