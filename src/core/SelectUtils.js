/**
 * Генератор уникальных ID для опций, где он явно не указан
 * Использует timestamp + инкрементальный счётчик
 *
 * @returns {string} Уникальный идентификатор
 */
export const generateId = (() => {
    let counter = 0;
    return () => String(Date.now() + counter++);
})();

/**
 * Нормализует массив опций:
 * - гарантирует уникальный `id`
 * - добавляет `key` (если отсутствует)
 * - приводит `active` к boolean
 *
 * @param {Array<Object>} options - Исходный массив опций
 * @param {Set<string>} [usedIds] - Уже использованные ID (для предотвращения коллизий)
 * @returns {Array<Object>} Нормализованный массив опций
 */
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

/**
 * Нормализует значение селекта в массив
 *
 * @param {any|Array<any>} value - Значение или массив значений
 * @returns {Array<any>} Массив значений
 */
export const normalizeValue = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) {
        return value;
    }

    return [value];
}

/**
 * Возвращает контейнер селекта из строки или HTMLElement
 *
 * @param {string|HTMLElement} selector - CSS-селектор или DOM-элемент
 * @returns {HTMLElement} Контейнер селекта
 * @throws {Error} Если элемент не найден или формат некорректен
 */
export const resolveContainer = (selector) => {
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

/**
 * Находит опцию по её ID
 *
 * @param {Array<Object>} options - Список опций
 * @param {string} id - Идентификатор опции
 * @returns {Object|undefined} Найденная опция или undefined
 */
export const findOptionById = (options, id) => options.find(opt => opt.id === id);

