class DataProxy {
  constructor(data) {
      this.data = data;  // Store the original data
      this.maskedData = {};  // Store the masked data
  }

  // Mask the data for a specific field (replace it with "****")
  maskData(field) {
      this.maskedData[field] = '****';
  }

  // Unmask the data for a specific field and reveal the original value
  unmaskData(field) {
      this.maskedData[field] = this.data[field];
  }

  // Get the data for a specific field, either masked or unmasked based on its status
  getData(field) {
      // If the field is masked, return the masked value, otherwise return the original value
      if (this.maskedData[field]) {
          return this.maskedData[field];
      } else {
          return this.data[field];
      }
  }
}

export default DataProxy;
