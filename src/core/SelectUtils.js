export const generateId = (() => {
    let counter = 0;
    return () => String(Date.now() + counter++);
})();

export const normalizeOptions = (options, usedIds = new Set()) => {
    return options.map(option => {
        let id = option.id;

        if (!id || usedIds.has(id)) {
            id = String(generateId());
        }

        usedIds.add(id);

        return {
            ...option,
            id,
            key: option.key ?? null,
            active: Boolean(option.active),
        };
    });
};

export const normalizeValue = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) {
        return value;
    }

    return [value];
}

export const _resolveContainer = (selector) => {
    if (selector instanceof HTMLElement) return selector;

    if (typeof selector === 'string') {
        const el = document.querySelector(selector);
        if (!el) {
            throw new Error(`CustomSelect: element not found for selector "${selector}"`);
        }
        return el;
    }

    throw new Error('CustomSelect: selector must be selector string or HTMLElement');
}

export const findOptionById = (options, id) => options.find(opt => opt.id === id);

