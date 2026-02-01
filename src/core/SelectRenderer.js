/**
 * Отвечает за рендеринг DOM-структуры селекта:
 * - базовая разметка
 * - список опций
 * - выбранные значения
 * - визуальное состояние активных опций
 *
 * @class
 */
export default class SelectRenderer {
    /**
     * @param {CustomSelect} select - Экземпляр CustomSelect
     */
    constructor(select) {
        /**
         * Ссылка на родительский CustomSelect
         * @type {CustomSelect}
         */
        this.select = select;
    }

    /**
     * Рендерит базовую HTML-структуру селекта
     * (value, dropdown, search, arrow)
     *
     * Вызывается один раз при инициализации
     *
     * @returns {void}
     */
    renderBase() {
        const { container, config } = this.select;

        container.innerHTML = '';

        const inner = document.createElement('div');
        inner.className = this.getClass('inner');

        inner.innerHTML = `
            <div class="${this.getClass('arrow')}"></div>
            <div class="${this.getClass(
                    'value',
                    config.multi ? 'cs-multi' : ''
                )}">
              <p class="${this.getClass('placeholder')}">
                ${config.placeholder || ''}
              </p>
            </div>
        
            <div class="${this.getClass('dropdown')}">
              ${
                    config.searchable
                        ? `<input 
                        type="text" 
                        class="${this.getClass('search')}" 
                        name="cs-search"
                    >`
                        : ''
                }
            </div>
        `;

        container.appendChild(inner);
        this.select.setInner(inner);

        /**
         * DOM-элементы, используемые в SelectEvents
         */
        this.valueEl = inner.querySelector('.cs-value');
        this.dropdownEl = inner.querySelector('.cs-dropdown');
        this.searchEl = inner.querySelector('.cs-search');
    }

    /**
     * Рендерит список опций в dropdown
     *
     * @param {Array<Object>} options - Список опций для отображения
     * @returns {void}
     */
    renderOptions(options) {
        const { selected } = this.select;

        this.dropdownEl
            .querySelectorAll('.cs-option')
            .forEach(el => el.remove());

        options.forEach(option => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = this.getClass('options');
            btn.dataset.id = option.id;

            // дополнительные data-атрибуты опции
            if (option.data && typeof option.data === 'object') {
                Object.entries(option.data).forEach(([key, value]) => {
                    btn.dataset[key] = value;
                });
            }

            btn.innerHTML = this.select.renderOption(option);
            this.dropdownEl.appendChild(btn);
        });

        this.highlightActiveOptions(selected);
    }

    /**
     * Рендерит выбранные значения в value-блоке
     *
     * @returns {void}
     */
    renderSelected() {
        const { selected, config } = this.select;

        this.highlightActiveOptions(selected);

        this.valueEl.innerHTML = '';

        if (!selected.length) {
            this.valueEl.innerHTML = `
                <p class="${this.getClass('placeholder')}">${config.placeholder || ''}</p>
            `;
            return;
        }

        selected.forEach(option => {
            const el = document.createElement('span');
            el.className = this.getClass('selected');
            el.dataset.id = option.id;

            el.innerHTML = `
                ${this.select.renderSelectedOption(option)}
            `;

            // можно добавить крестики, для удаления активного опшиона
            // не открывая дропдаун в мульти режиме:
            // ${config.multi ? `<button type="button" class="cs-remove">×</button>` : ''}

            this.valueEl.appendChild(el);
        });
    }

    /**
     * Подсвечивает активные опции в dropdown
     *
     * @param {Array<Object>} selected - Выбранные опции
     * @returns {void}
     */
    highlightActiveOptions(selected) {
        const options = this.select.container.querySelectorAll('.cs-option');

        const selectedIds = selected.map(item => item.id);
        const selectedOptions = Array.from(options)
            .filter(option => selectedIds.includes(option.dataset.id));

        options.forEach(option => {
            option.classList.remove('cs-option--selected');
        })

        selectedOptions.forEach(option => {
            option.classList.add('cs-option--selected');
        })
    }

    /**
     * Возвращает CSS-класс с учетом:
     * - дефолтного класса
     * - кастомного класса из this.select.config.classes
     * - дополнительного класса
     *
     * @param {string} name - Ключ класса
     * @param {string} [extra] - Дополнительный класс
     * @returns {string}
     */
    getClass(name, extra = '') {
        const defaults = {
            inner: 'cs-inner',
            value: 'cs-value',
            dropdown: 'cs-dropdown',
            placeholder: 'cs-placeholder',
            arrow: 'cs-arrow',
            search: 'cs-search',
            selected: 'cs-selected',
            options: 'cs-option'
        };

        const custom = this.select.config.classes?.[name];

        const normalize = v =>
            Array.isArray(v) ? v.join(' ') : v || '';

        return [
            defaults[name],
            normalize(custom),
            extra
        ].filter(Boolean).join(' ');
    }
}
