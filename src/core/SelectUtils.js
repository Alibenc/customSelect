// export const generateId = () => {
//     return Date.now() + Math.floor(Math.random() * 1000);
// }
//
// export const filterOptions = (options, query) => {
//     return options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));
// }

// export const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

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

        return { ...option, id,  key: option.key ?? null, };
    });
};

export const normalizeValue = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) {
        return value;
    }

    return [value];
}
//
// export const normalizeValue = (value, multi) => {
//     if (multi) {
//         return Array.isArray(value) ? value : value ? [value] : [];
//     }
//     return value ?? null;
// };

export const findOptionById = (options, id) => options.find(opt => opt.id === id);

