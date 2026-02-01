export default class SelectRenderer {
    constructor(select) {
        this.select = select;
    }

    renderBase() {
        const { container, config } = this.select;

        container.innerHTML = '';

        const inner = document.createElement('div');
        inner.className = 'cs-inner';

        inner.innerHTML = `
            <div class="cs-arrow"></div>
            <div class="cs-value ${config.multi ? 'cs-multi' : ''}">
                <p class="cs-placeholder">${config.placeholder || ''}</p>
            </div>
            <div class="cs-dropdown">
                ${config.searchable ? 
                    `<input type="text" class="cs-search" name="cs-search">` 
                        : 
                    ''
                }
            </div>
        `;

        container.appendChild(inner);
        this.select.setInner(inner);

        this.valueEl = container.querySelector('.cs-value');
        this.dropdownEl = container.querySelector('.cs-dropdown');
        this.searchEl = container.querySelector('.cs-search');
    }

    renderOptions(options) {
        const { selected } = this.select;

        this.dropdownEl
            .querySelectorAll('.cs-option')
            .forEach(el => el.remove());

        options.forEach(option => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'cs-option';
            btn.dataset.id = option.id;


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

    renderSelected() {
        const { selected, config } = this.select;

        this.highlightActiveOptions(selected);

        this.valueEl.innerHTML = '';

        if (!selected.length) {
            this.valueEl.innerHTML = `
                <p class="cs-placeholder">${config.placeholder || ''}</p>
            `;
            return;
        }

        selected.forEach(option => {
            const el = document.createElement('span');
            el.className = 'cs-selected';
            el.dataset.id = option.id;

            el.innerHTML = `
                ${this.select.renderSelectedOption(option)}
            `;

            // можно добавить крестики, для удаления активного опшиона в мульти режиме:
            // ${config.multi ? `<button type="button" class="cs-remove">×</button>` : ''}

            this.valueEl.appendChild(el);
        });
    }

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
}
