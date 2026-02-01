import SelectRenderer from './SelectRenderer.js';
import SelectEvents from './SelectEvents.js';
import SelectConfig from './SelectConfig.js';
import SelectDynamic from './SelectDynamic/SelectDynamic.js';

import {_resolveContainer, findOptionById, normalizeOptions, normalizeValue} from './SelectUtils.js';

import '../assets/styles/style.css';

export class CustomSelect {
    constructor(config) {
        this.config = SelectConfig.normalize(config);
        console.log(this.config)

        this.container = _resolveContainer(this.config.selector);

        if (!this.container) {
            throw new Error('CustomSelect: container not found');
        }

        this.options = normalizeOptions(this.config.options || []);
        this.selected = [];
        this._initValueFromOptions();

        this.renderOption =
            this.config.renderers?.renderOption || (opt => opt.label);

        this.renderSelectedOption =
            this.config.renderers?.renderSelectedOption || (opt => opt.label);

        this.renderer = new SelectRenderer(this);
        this.events = new SelectEvents(this);
        this.dynamic = new SelectDynamic(this);

        this.init();
    }

    init() {
        this.renderer.renderBase();
        this.renderer.renderOptions(this.options);
        this.renderer.renderSelected();
        this.events.bind();
    }

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


        // this.emit('onChange', this.getValue());
        this._emitChange();
        this.renderer.renderSelected();
    }

    deselect(id) {
        const option = findOptionById(this.selected, id);
        if (!option) return;

        this.selected = this.selected.filter(o => o.id !== id);
        this.emit('onDeselect', option);
        // this.emit('onChange', this.getValue());
        this._emitChange();
        this.renderer.renderSelected();
    }

    filterOptions(query) {
        const q = query.toLowerCase();

        const filtered = this.options.filter(opt =>
            opt.label.toLowerCase().includes(q)
        );

        this.renderer.renderOptions(filtered);
    }

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

    getValue() {
        return this.selected;
    }

    setValue(value) {
        const normalized = normalizeValue(value);

        if (this.config.multi) {
            this.selected = normalized;
        } else {
            this.selected = normalized.slice(0, 1);
        }

        // this.emit('onChange', this.getValue());
        this._emitChange();
        this.renderer.renderSelected();
    }

    clear() {
        this.selected = [];
        // this.emit('onChange', this.getValue());
        this._emitChange();
        this.renderer.renderSelected();
    }

    addOptions(newOptions) {
        const usedIds = new Set(this.options.map(o => o.id));

        const normalized = normalizeOptions(newOptions, usedIds);

        this.options = [...this.options, ...normalized];

        this.renderer.renderOptions(this.options);
    }

    removeOption(id) {
        this.options = this.options.filter(o => o.id !== id);
        this.selected = this.selected.filter(o => o.id !== id);
        this.renderer.renderOptions(this.options);
        this.renderer.renderSelected();
    }

    // destroy() {
    //     this.container.innerHTML = '';
    // }

    emit(name, payload) {
        const fn = this.config.events?.[name];
        if (typeof fn === 'function') fn(payload);
    }

    _emitChange() {
        const payload = {
            value: this.getValue()
        };

        this.dynamic.emitter.emit('change', payload);

        this.emit('onChange', this.getValue());
    }

    _initValueFromOptions() {
        const activeOptions = this.options.filter(o => o.active);

        if (!activeOptions.length) return;

        this.selected = this.config.multi
            ? activeOptions
            : [activeOptions[0]];

        this.options.forEach(o => delete o.active);
    }

    setOpenState(isOpen, source = 'programmatic') {
        const opened = this.inner.classList.contains('cs-open');

        if (opened === isOpen) return;

        this.inner.classList.toggle('cs-open', isOpen);

        this.emit(isOpen ? 'onOpen' : 'onClose', { source });
        this.emit(isOpen ? 'onFocus' : 'onBlur', { source });
    }

    open(source) {
        this.setOpenState(true, source);
    }

    close(source) {
        this.setOpenState(false, source);
    }

    toggle(source) {
        this.setOpenState(
            !this.inner.classList.contains('cs-open'),
            source
        );
    }

    setInner(el) {
        this.inner = el;
    }

    destroy() {
        this.dynamic?.destroyAll();
        this.events?.destroy?.();
        this.container.remove();
    }
}
