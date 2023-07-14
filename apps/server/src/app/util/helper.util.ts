export class HelperUtil {
    public static removeDoubleQuotes(obj) {
        if (obj) {
            if (Array.isArray(obj)) {
                return obj.map(val => this.removeDoubleQuotes(val));
            } else if (typeof obj === 'object' && obj !== null) {
                const newObj = {};
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        const value = obj[key];
                        if (typeof value === 'object') {
                            newObj[key] = this.removeDoubleQuotes(value);
                        } else if (typeof value === 'string') {
                            newObj[key] = value.replace(/^"(.*)"$/, '$1');
                        } else {
                            newObj[key] = value;
                        }
                    }
                }
                return newObj;
            } else {
                return obj;
            }
        }
    }
}
