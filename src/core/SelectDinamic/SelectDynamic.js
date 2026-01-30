import {CustomSelect} from '../CustomSelect';
import EventEmitter from "./EventEmitter";

export default class SelectDynamic {
    constructor(select) {
        this.select = select;
        this.rules = select.config.dynamic || [];
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

            const key = this.getRuleKey(rule);

            if (shouldExist) {
                if (!this.children.has(key)) {
                    this.create(rule, key);
                }
            } else {
                if (this.children.has(key)) {
                    this.destroy(key);
                }
            }
        });
    }

    create(rule, key) {
        const parentEl = this.select.container;

        const mountEl = rule.create.mount
            ? rule.create.mount(parentEl)
            : document.querySelector(rule.create.selector);

        console.log(mountEl);

        if (!mountEl) return;

        // const select = new CustomSelect({
        //     ...rule.create.config,
        //     selector: mountEl
        // });
        //
        // this.children.set(key, {
        //     select,
        //     mountEl,
        //     createdByMount: !!rule.create.mount
        // });
    }

    destroy(key) {
        const child = this.children.get(key);
        if (!child) return;

        child.select.destroy?.();

        if (child.createdByMount) {
            child.mountEl.remove();
        }

        this.children.delete(key);
    }

    destroyAll() {
        this.children.forEach((_, key) => this.destroy(key));
    }

    getRuleKey(rule) {
        return JSON.stringify(rule.when) +
            (rule.create.selector || '');
    }
}
