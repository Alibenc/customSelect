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

        return parsed;
    }

    static reviveFunctions(obj) {
        if (!obj) return;

        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'string') {
                obj[key] = new Function(`return ${obj[key]}`)();
            }
        });
    }
}
