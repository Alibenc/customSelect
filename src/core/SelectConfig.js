export default class SelectConfig {
    static normalize(config) {
        if (typeof config === 'string') {
            return this.fromJSONString(config);
        }

        if (typeof config === 'object') {
            return config;
        }

        throw new Error('CustomSelect: invalid config format');
    }

    static fromJSONString(json) {
        const parsed = JSON.parse(json);
        parsed.selector = parsed.selector.trim().replace(/[\u200B-\u200D\uFEFF]/g, '');

        this.reviveFunctions(parsed.events);
        this.reviveFunctions(parsed.renderers);

        if (Array.isArray(parsed.dynamic)) {
            this.reviveFunctions(parsed.dynamic);
        }

        return parsed;
    }

    static reviveFunctions(obj) {
        if (!obj || typeof obj !== 'object') return;

        Object.keys(obj).forEach(key => {
            const value = obj[key];

            if (typeof value === 'string' && value.trim().startsWith('function')) {
                obj[key] = new Function(`return (${value})`)();
            } else if (typeof value === 'object') {
                this.reviveFunctions(value);
            }
        });
    }
}
