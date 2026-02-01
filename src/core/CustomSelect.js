import SelectRenderer from './SelectRenderer.js';
import SelectEvents from './SelectEvents.js';
import SelectConfig from './SelectConfig.js';
import SelectDynamic from './SelectDynamic/SelectDynamic.js';

import {resolveContainer, findOptionById, normalizeOptions, normalizeValue} from './SelectUtils.js';

import '../assets/styles/style.css';

/**
 * Главный класс кастомного селекта
 * @class
 */
export class CustomSelect {
    /**
     * Создает новый кастомный селект
     * @param {Object} config - Конфигурация селекта
     * @param {string|HTMLElement} config.selector - CSS селектор или DOM-элемент контейнера
     * @param {Array<Object>} [config.options] - Массив опций {id, label, active}
     * @param {boolean} [config.multi=false] - Разрешен ли мультивыбор
     * @param {boolean} [config.allowCustom=false] - Разрешено ли добавлять кастомные опции
     * @param {Object} [config.renderers] - Переопределение функций рендеринга
     * @param {Function} [config.renderers.renderOption] - Функция для рендеринга опции
     * @param {Function} [config.renderers.renderSelectedOption] - Функция для рендеринга выбранной опции
     * @param {Object} [config.events] - Коллбеки событий (onSelect, onDeselect, onChange, onOpen, onClose, onFocus, onBlur, onCustomOption)
     */
    constructor(config) {
        /** @type {Object} Нормализованный конфиг селекта */
        this.config = SelectConfig.normalize(config);

        /** @type {HTMLElement} Контейнер селекта */
        this.container = resolveContainer(this.config.selector);

        if (!this.container) {
            throw new Error('CustomSelect: container not found');
        }

        /** @type {Array<Object>} Все опции селекта */
        this.options = normalizeOptions(this.config.options || []);

        /** @type {Array<Object>} Выбранные опции */
        this.selected = [];
        this._initValueFromOptions();

        /** @type {Function} Функция для рендеринга опции */
        this.renderOption =
            this.config.renderers?.renderOption || (opt => opt.label);

        /** @type {Function} Функция для рендеринга выбранной опции */
        this.renderSelectedOption =
            this.config.renderers?.renderSelectedOption || (opt => opt.label);

        /** @type {SelectRenderer} Экземпляр рендера */
        this.renderer = new SelectRenderer(this);

        /** @type {SelectEvents} Экземпляр событий */
        this.events = new SelectEvents(this);

        /** @type {SelectDynamic} Экземпляр динамических опций */
        this.dynamic = new SelectDynamic(this);

        this.init();
    }

    /**
     * Инициализация селекта: рендер базовой структуры, опций и выбранных элементов
     * @returns {void}
     */
    init() {
        this.renderer.renderBase();
        this.renderer.renderOptions(this.options);
        this.renderer.renderSelected();
        this.events.bind();
    }

    /**
     * Переключает выбор опции по id
     * @param {string} id - Идентификатор опции
     * @returns {void}
     */
    toggleOption(id) {
        const option = findOptionById(this.options, id);
        if (!option) return;

        const exists = this.selected.find(o => o.id === id);

        if (exists) {
            this.deselect(id);
        } else {
            if (!this.config.multi) this.selected = [];
            this.selected.push(option);
            this.emit('onSelect', option);
        }

        this._emitChange();
        this.renderer.renderSelected();
    }

    /**
     * Снимает выбор опции по id
     * @param {string} id - Идентификатор опции
     * @returns {void}
     */
    deselect(id) {
        const option = findOptionById(this.selected, id);
        if (!option) return;

        this.selected = this.selected.filter(o => o.id !== id);
        this.emit('onDeselect', option);
        this._emitChange();
        this.renderer.renderSelected();
    }

    /**
     * Фильтрует опции по строке запроса
     * @param {string} query - Строка поиска
     * @returns {void}
     */
    filterOptions(query) {
        const q = query.toLowerCase();

        const filtered = this.options.filter(opt =>
            opt.label.toLowerCase().includes(q)
        );

        this.renderer.renderOptions(filtered);
    }

    /**
     * Создает кастомную опцию, если разрешено конфигом
     * @param {string} label - Метка новой опции
     * @returns {void}
     */
    tryCreateCustomOption(label) {
        if (!this.config.allowCustom || !label.trim()) return;

        const exists = this.options.find(
            o => o.label.toLowerCase() === label.toLowerCase()
        );
        if (exists) return;

        const option = {
            id: Date.now().toString(),
            label
        };

        this.options.push(option);
        this.emit('onCustomOption', option);
        this.toggleOption(option.id);
        this.renderer.renderOptions(this.options);
        this.renderer.searchEl.value = '';
    }

    /**
     * Возвращает выбранные значения
     * @returns {Array<Object>} Массив выбранных опций
     */
    getValue() {
        return this.selected;
    }

    /**
     * Устанавливает выбранные значения
     * @param {Array<Object>|Object} value - Значение/значения для установки
     * @returns {void}
     */
    setValue(value) {
        const normalized = normalizeValue(value);

        if (this.config.multi) {
            this.selected = normalized;
        } else {
            this.selected = normalized.slice(0, 1);
        }

        this._emitChange();
        this.renderer.renderSelected();
    }

    /**
     * Очищает выбранные значения
     * @returns {void}
     */
    clear() {
        this.selected = [];
        this._emitChange();
        this.renderer.renderSelected();
    }

    /**
     * Добавляет новые опции
     * @param {Array<Object>|Object} newOptions - Новые опции
     * @returns {void}
     */
    addOptions(newOptions) {
        const usedIds = new Set(this.options.map(o => o.id));

        const normalized = normalizeOptions(newOptions, usedIds);

        this.options = [...this.options, ...normalized];

        this.renderer.renderOptions(this.options);
    }

    /**
     * Удаляет опцию по id
     * @param {string} id - Идентификатор опции
     * @returns {void}
     */
    removeOption(id) {
        this.options = this.options.filter(o => o.id !== id);
        this.selected = this.selected.filter(o => o.id !== id);
        this.renderer.renderOptions(this.options);
        this.renderer.renderSelected();
    }

    /**
     * Вызывает коллбек события из конфига
     * @param {string} name - Имя события
     * @param {*} [payload] - Данные события
     * @returns {void}
     */
    emit(name, payload) {
        const fn = this.config.events?.[name];
        if (typeof fn === 'function') fn(payload);
    }

    /**
     * Устанавливает состояние открытия селекта
     * @param {boolean} isOpen - Открыт или закрыт
     * @param {string} [source='programmatic'] - Источник события
     * @returns {void}
     */
    setOpenState(isOpen, source = 'programmatic') {
        const opened = this.inner.classList.contains('cs-open');

        if (opened === isOpen) return;

        this.inner.classList.toggle('cs-open', isOpen);

        this.emit(isOpen ? 'onOpen' : 'onClose', { source });
        this.emit(isOpen ? 'onFocus' : 'onBlur', { source });
    }

    /**
     * Открывает селект
     * @param {string} [source] - Источник события
     * @returns {void}
     */
    open(source) {
        this.setOpenState(true, source);
    }

    /**
     * Закрывает селект
     * @param {string} [source] - Источник события
     * @returns {void}
     */
    close(source) {
        this.setOpenState(false, source);
    }

    /**
     * Переключает состояние открытия селекта
     * @param {string} [source] - Источник события
     * @returns {void}
     */
    toggle(source) {
        this.setOpenState(
            !this.inner.classList.contains('cs-open'),
            source
        );
    }

    /**
     * Устанавливает внутренний элемент, внутри которого будет сам селект
     * @param {HTMLElement} el - Элемент DOM
     * @returns {void}
     */
    setInner(el) {
        this.inner = el;
    }

    /**
     * Уничтожает селект, отписывая все события и удаляя контейнер
     * @returns {void}
     */
    destroy() {
        this.dynamic?.destroyAll();
        this.events?.destroy?.();
        this.container.remove();
    }

    /**
     * Приватный метод: эмиттит событие изменения значения
     * @private
     * @returns {void}
     */
    _emitChange() {
        const payload = {
            value: this.getValue()
        };

        this.dynamic.emitter.emit('change', payload);

        this.emit('onChange', this.getValue());
    }

    /**
     * Приватный метод: инициализирует выбранные значения из опций с active
     * если у single селекта несклько таких, берет первый
     * @private
     * @returns {void}
     */
    _initValueFromOptions() {
        const activeOptions = this.options.filter(o => o.active);

        if (!activeOptions.length) return;

        this.selected = this.config.multi
            ? activeOptions
            : [activeOptions[0]];

        this.options.forEach(o => delete o.active);
    }
}
