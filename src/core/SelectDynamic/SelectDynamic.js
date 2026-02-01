import {CustomSelect} from '../CustomSelect';
import EventEmitter from "./EventEmitter";

/**
 * Класс для управления динамическими селектами.
 * Создает и удаляет дочерние селекты в зависимости
 * от выбранных значений родительского селекта.
 *
 * @class
 */
export default class SelectDynamic {
    /**
     * Создает менеджер динамических селектов
     *
     * @param {CustomSelect} select - Родительский селект
     */
    constructor(select) {
        /**
         * Родительский селект
         * @type {CustomSelect}
         */
        this.select = select;

        /**
         * Правила динамических селектов,
         * расширенные уникальным внутренним идентификатором
         *
         * @type {Array<Object>}
         */
        this.rules = (select.config.dynamic || []).map(rule => ({
            ...rule,
            __id: crypto.randomUUID(),
        }));

        /**
         * Карта созданных дочерних селектов
         * key — rule.__id
         * value — { select, mountEl, createdByMount }
         *
         * @type {Map<string, Object>}
         */
        this.children = new Map();

        /**
         * Внутренний emitter для отслеживания изменений значений
         * @type {EventEmitter}
         */
        this.emitter = new EventEmitter();

        if (this.rules.length) {
            this.bind();
        }
    }

    /**
     * Подписывается на события изменения значения родительского селекта
     *
     * @returns {void}
     */
    bind() {
        this.emitter.on('change', ({ value }) => this.handleChange(value))
    }

    /**
     * Обрабатывает изменение выбранных опций
     * и решает, создавать или удалять динамические селекты
     *
     * @param {Array<Object>} selectedOptions - Выбранные опции родительского селекта
     * @returns {void}
     */
    handleChange(selectedOptions) {
        this.rules.forEach(rule => {
            const shouldExist = selectedOptions.some(opt =>
                rule.when.includes(opt.key)
            );

            const id = rule.__id;

            if (shouldExist) {
                if (!this.children.has(id)) {
                    this.create(rule);
                }
            } else {
                if (this.children.has(id)) {
                    this.destroy(id);
                }
            }
        });
    }

    /**
     * Создает динамический селект по правилу
     *
     * @param {Object} rule - Правило динамического селекта из конфига
     * @returns {void}
     */
    create(rule) {
        const parentEl = this.select.container;

        const mountEl = this._mount(parentEl, rule);

        if (!mountEl) return;

        const select = new CustomSelect({
            ...rule.create.config,
            selector: mountEl
        });

        this.children.set(rule.__id, {
            select,
            mountEl,
            createdByMount: !!rule.create.mount
        });
    }

    /**
     * Уничтожает динамический селект по идентификатору правила
     *
     * @param {string} id - Внутренний идентификатор правила
     * @returns {void}
     */
    destroy(id) {
        const child = this.children.get(id);
        if (!child) return;

        child.select.destroy?.();

        if (child.createdByMount) {
            child.mountEl.remove();
        }

        this.children.delete(id);
    }

    /**
     * Уничтожает все динамические селекты
     *
     * @returns {void}
     */
    destroyAll() {
        this.children.forEach((_, id) => this.destroy(id));
    }

    /**
     * Стандартный способ монтирования динамического селекта.
     * Создает контейнер и добавляет его в DOM, а именно в контейнер родительского селекта.
     *
     * @private
     * @param {HTMLElement} parent - Контейнер родительского селекта
     * @returns {HTMLElement} Элемент для монтирования селекта
     */
    _defaultMount(parent) {
        const el = document.createElement('div');
        el.className = 'cs-dynamic';
        parent.appendChild(el);
        return el;
    }

    /**
     * Возвращает элемент для монтирования динамического селекта.
     * Может использовать пользовательскую функцию mount
     * или стандартную реализацию.
     *
     * @private
     * @param {HTMLElement} parent - Контейнер родительского селекта
     * @param {Object} rule - Правило динамического селекта из конфига
     * @returns {HTMLElement} Элемент для монтирования
     */
    _mount(parent, rule) {
        const mount = rule.create.mount || this._defaultMount;
        return mount(parent);
    }
}
