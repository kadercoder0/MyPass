// DataProxy.js

class DataProxy {
    constructor(data) {
      this.data = data;
      this.maskedData = {};
    }
  
    maskData(field) {
      // Masks the data for a specific field
      this.maskedData[field] = '****';
    }
  
    unmaskData(field) {
      // Unmasks the data for a specific field
      this.maskedData[field] = this.data[field];
    }
  
    getData(field) {
      // Returns the masked or unmasked data depending on the status
      if (this.maskedData[field]) {
        return this.maskedData[field];
      } else {
        return this.data[field];
      }
    }
  }
  
  export default DataProxy;
  