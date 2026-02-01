export default class EventEmitter {
    constructor() {
        this.listeners = {};
    }

    on(event, handler) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }

        this.listeners[event].push(handler);
    }

    off(event, handler) {
        if (!this.listeners[event]) return;

        this.listeners[event] =
            this.listeners[event].filter(h => h !== handler);
    }

    emit(event, payload) {
        if (!this.listeners[event]) return;

        this.listeners[event].forEach(handler => handler(payload));
    }

    clear() {
        this.listeners = {};
    }
}