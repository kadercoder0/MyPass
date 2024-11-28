class SessionManager {
    static instance;
  
    // Private constructor to prevent instantiation from outside
    constructor() {
      if (SessionManager.instance) {
        return SessionManager.instance; // Return the existing instance
      }
  
      // Initialize properties
      this.user = null;
      this.sessionKey = 'user';
  
      // Set the instance to the current one
      SessionManager.instance = this;
    }
  
    // Method to set user data to localStorage
    setUser(user) {
      this.user = user;
      localStorage.setItem(this.sessionKey, JSON.stringify(user));
    }
  
    // Method to get user data from localStorage
    getUser() {
      if (!this.user) {
        this.user = JSON.parse(localStorage.getItem(this.sessionKey));
      }
      return this.user;
    }
  
    // Method to clear the session (logout)
    clearSession() {
      this.user = null;
      localStorage.removeItem(this.sessionKey);
    }
  }
  
  export default new SessionManager();
  