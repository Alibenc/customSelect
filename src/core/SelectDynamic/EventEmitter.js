/**
 * Простейший EventEmitter для внутреннего обмена событиями.
 * Не связан с DOM и предназначен для использования внутри библиотеки.
 *
 * @class
 */
export default class EventEmitter {
    constructor() {
        /**
         * Хранилище обработчиков событий
         * key — имя события
         * value — массив обработчиков
         *
         * @type {Object<string, Function[]>}
         */
        this.listeners = {};
    }

    /**
     * Подписка на событие
     *
     * @param {string} event - Имя события
     * @param {Function} handler - Функция-обработчик
     * @returns {void}
     */
     on(event, handler) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }

        this.listeners[event].push(handler);
    }

    /**
     * Генерация события
     *
     * @param {string} event - Имя события
     * @param {*} [payload] - Данные события
     * @returns {void}
     */
     emit(event, payload) {
        if (!this.listeners[event]) return;

        this.listeners[event].forEach(handler => handler(payload));
    }
}