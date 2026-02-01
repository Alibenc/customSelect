import {CustomSelect} from '../CustomSelect';
import EventEmitter from "./EventEmitter";

export default class SelectDynamic {
    constructor(select) {
        this.select = select;
        this.rules = (select.config.dynamic || []).map(rule => ({
            ...rule,
            __id: crypto.randomUUID(),
        }));
        this.children = new Map();

        this.emitter = new EventEmitter();

        if (this.rules.length) {
            this.bind();
        }
    }

    bind() {
        this.emitter.on('change', ({ value }) => this.handleChange(value))
        console.log(this.select)
    }

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

    create(rule) {
        const parentEl = this.select.container;

        // const mountEl = rule.create.mount(parentEl);
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

    destroy(id) {
        const child = this.children.get(id);
        if (!child) return;

        child.select.destroy?.();

        if (child.createdByMount) {
            child.mountEl.remove();
        }

        this.children.delete(id);
    }

    destroyAll() {
        this.children.forEach((_, id) => this.destroy(id));
    }

    _defaultMount(parent) {
        const el = document.createElement('div');
        el.className = 'cs-dynamic';
        parent.appendChild(el);
        return el;
    }

    _mount(parent, rule) {
        const mount = rule.create.mount || this._defaultMount;
        return mount(parent);
    }
}
