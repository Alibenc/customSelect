/**
 * Класс для нормализации и подготовки конфигурации селекта.
 * Поддерживает передачу конфига как объекта или JSON-строки.
 *
 * @class
 */
export default class SelectConfig {
    /**
     * Нормализует конфигурацию селекта.
     * Принимает либо объект, либо JSON-строку.
     *
     * @param {Object|string} config - Конфигурация селекта
     * @returns {Object} Нормализованный конфиг
     * @throws {Error} Если формат конфига не поддерживается
     */
    static normalize(config) {
        if (typeof config === 'string') {
            return this.fromJSONString(config);
        }

        if (typeof config === 'object') {
            return config;
        }

        throw new Error('CustomSelect: invalid config format');
    }

    /**
     * Преобразует JSON-строку в объект конфига.
     * Также:
     * - очищает selector от невидимых unicode-символов
     * - восстанавливает функции из строкового представления
     *
     * @param {string} json - JSON-строка конфигурации
     * @returns {Object} Распарсенный и нормализованный конфиг
     * @throws {SyntaxError} Если JSON некорректен
     */
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

    /**
     * Рекурсивно восстанавливает функции из строкового представления.
     * Поддерживает строки, начинающиеся с "function".
     *
     * !!! Использует `new Function`, поэтому предполагается,
     * что конфиг приходит из доверенного источника.
     *
     * @param {Object} obj - Объект, в котором нужно восстановить функции
     * @returns {void}
     */
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
