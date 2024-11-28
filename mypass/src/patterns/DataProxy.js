// DataProxy.js
class DataProxy {
    constructor(data, sensitiveFields) {
        this.sensitiveFields = sensitiveFields; // Fields that require masking
        this.unmaskedFields = {}; // Tracks the unmasked state of fields
        this.proxy = new Proxy(data, {
            get: (target, prop) => {
                if (this.sensitiveFields.includes(prop) && !this.unmaskedFields[prop]) {
                    return "****"; // Masked value
                }
                return target[prop];
            },
            set: (target, prop, value) => {
                target[prop] = value;
                return true;
            },
        });
    }

    toggleMask(field) {
        if (this.sensitiveFields.includes(field)) {
            this.unmaskedFields[field] = !this.unmaskedFields[field];
        }
    }

    isUnmasked(field) {
        return !!this.unmaskedFields[field];
    }

    getProxy() {
        return this.proxy;
    }
}

export default DataProxy;
