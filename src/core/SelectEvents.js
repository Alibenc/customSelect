/**
 * Глобальный менеджер кликов вне селекта.
 * Использует один document-click listener для всех селектов,
 * чтобы оптимизировать производительность.
 *
 * @class
 */
class OutsideClickManager {
    /**
     * Зарегистрированные селекты
     * @type {Set<Object>}
     */
    static selects = new Set();

    /**
     * Флаг инициализации глобального слушателя
     * @type {boolean}
     */
    static initialized = false;

    /**
     * Регистрирует селект для отслеживания кликов вне него
     *
     * @param {Object} select - Экземпляр CustomSelect
     * @returns {void}
     */
    static register(select) {
        this.selects.add(select);

        if (!this.initialized) {
            document.addEventListener('click', this.handleClick);
            this.initialized = true;
        }
    }

    /**
     * Обработчик клика по документу.
     * Закрывает селекты, если клик был вне их области.
     *
     * @param {MouseEvent} e - Событие клика
     * @returns {void}
     */
    static handleClick = (e) => {
        this.selects.forEach(select => {
            if (!select.container.contains(e.target.closest('.cs-inner'))) {
                select.close('outside');
            }
        });
    };
}

/**
 * Класс для управления DOM-событиями селекта.
 * Отвечает за клики, ввод в поиск, фокус и blur.
 *
 * @class
 */
export default class SelectEvents {
    /**
     * Создает менеджер событий для селекта
     *
     * @param {Object} select - Экземпляр CustomSelect
     */
    constructor(select) {
        /**
         * Экземпляр кастомного селекта
         * @type {Object}
         */
        this.select = select;

        OutsideClickManager.register(select);
    }

    /**
     * Привязывает все DOM-события селекта
     *
     * @returns {void}
     */
    bind() {
        const {container, renderer} = this.select;

        // Клик по опции в dropdown
        renderer.dropdownEl.addEventListener('click', e => {
            const option = e.target.closest('.cs-option');

            if (!option) return;

            this.select.toggleOption(option.dataset.id);
            this.select.close();
        });

        // Клик по выбранному значению
        renderer.valueEl.addEventListener('click', e => {
            const remove = e.target.closest('.cs-remove');
            if (remove) {
                const id = remove.closest('.cs-selected').dataset.id;
                this.select.deselect(id);
                return;
            }

            this.select.toggle();
        });

        // Поиск и ввод кастомных опций
        if (renderer.searchEl) {
            renderer.searchEl.addEventListener('input', e => {
                this.select.filterOptions(e.target.value);
            });

            renderer.searchEl.addEventListener('keydown', e => {
                if (e.key === 'Enter') {
                    this.select.tryCreateCustomOption(e.target.value);
                }
            });
        }

        // Фокус внутри селекта
        container.addEventListener('focusin', () => {
            this.select.emit('onFocus');
        });

        // Потеря фокуса селекта
        container.addEventListener('focusout', () => {
            this.select.emit('onBlur');
        });
    }
}
