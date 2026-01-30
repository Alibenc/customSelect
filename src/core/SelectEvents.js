// глобальный менеджер одного слушателя событий для закрытия при клике вне селекта
class OutsideClickManager {
    static selects = new Set();
    static initialized = false;


    static register(select) {
        this.selects.add(select);

        if (!this.initialized) {
            document.addEventListener('click', this.handleClick);
            this.initialized = true;
        }
    }

    static unregister(select) {
        this.selects.delete(select);
    }

    static handleClick = (e) => {
        this.selects.forEach(select => {
            if (!select.container.contains(e.target.closest('.cs'))) {
                select.close('outside');
            }
        });
    };
}

export default class SelectEvents {
    constructor(select) {
        this.select = select;

        OutsideClickManager.register(select);
    }

    bind() {
        const {container, renderer} = this.select;

        // обработка option
        renderer.dropdownEl.addEventListener('click', e => {
            const option = e.target.closest('.cs-option');

            if (!option) return;

            this.select.toggleOption(option.dataset.id);
            // this.select.selectOption(option.dataset.id);
            this.select.close();
        });

        // открыть/закрыть/удалить
        renderer.valueEl.addEventListener('click', e => {
            const remove = e.target.closest('.cs-remove');
            if (remove) {
                const id = remove.closest('.cs-selected').dataset.id;
                this.select.deselect(id);
                return;
            }

            this.select.toggle();
        });

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

        container.addEventListener('focusin', () => {
            this.select.emit('onFocus');
        });

        container.addEventListener('focusout', () => {
            this.select.emit('onBlur');
        });
    }
}
