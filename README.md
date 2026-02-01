# CustomSelect

Лёгкая JavaScript-библиотека для создания кастомных селектов  
на чистом JS без зависимостей, с поддержкой:

- одиночного и множественного выбора
- поиска
- кастомных опций
- динамических селектов (зависящих от выбранных значений)
- полной кастомизации рендера и событий

---

## 📦 Установка и сборка

### Установка зависимостей

```bash
npm install
```

### Сборка production-версии

```bash
npm run build:prod
```

Результат будет находиться в папке `dist/`. Пример работы с результатом билда находится в папке `test/`

### Режим разработки

```bash
npm run dev
```

Запускает `webpack-dev-server` с автоперезагрузкой и тестовой инициализацией  
(логика в `src/index.js` используется **только для разработки**).

---

## 🚀 Быстрый старт

### HTML

```html
<div id="my-select"></div>
```

### JS

```js
import { CustomSelect } from './CustomSelect';

new CustomSelect({
  selector: '#my-select',
  placeholder: 'Выберите значение',
  options: [
    { label: 'Россия', key: 'ru' },
    { label: 'Беларусь', key: 'by' }
  ]
});
```

---

## ⚙️ Конфигурация

### selector (обязательно)

CSS-селектор или HTMLElement, в который будет смонтирован селект.

```js
selector: '#my-select'
```

---

### options

```js
options: [
  {
    id: 'ru',  // необязательно, будет сгенерирован автоматически
    label: 'Россия',  // отображаемый текст (обязательно)
    key: 'ru', // ключ (используется в dynamic). 
               // Не обязателен, если не планируется dynamic
    active: true,  // будет выбран при инициализации
    data: { code: '7' } // дополнительные data-атрибуты
  }
]
```

---

### multi
Разрешает множественный выбор.
```js
multi: true
```

---

### placeholder
Текст плейсхолдера, когда ничего не выбрано.
```js
placeholder: 'Выберите страну'
```

---

### searchable
Добавляет поле поиска по опциям.
```js
searchable: true
```

---

### allowCustom
Разрешает создание пользовательских опций через Enter в поле поиска.
```js
allowCustom: true
```

---

## 🎨 Кастомизация рендера
Позволяет переопределить дефолтный рендер опций и выбранных значений.
```js
renderers: {
  renderOption(option) {
    return `<strong>${option.label}</strong>`;
  },
  renderSelectedOption(option) {
    return option.label;
  }
}
```

---

## 🎯 События

```js
events: {
  onChange(value) {
    console.log(value);
  }
    onSelect(option) {
        console.log('Выбрано:', option);
    },

    onDeselect(option) {
        console.log('Выбор снят:', option);
    },

    onOpen({ source }) {
        console.log('Открыт:', source);
    },

    onClose({ source }) {
        console.log('Закрыт:', source);
    },

    onFocus() {},
    onBlur() {},

    onCustomOption(option) {
        console.log('Создана кастомная опция:', option);
    }
}
```

---

## 🧩 Dynamic Selects
Позволяют создавать селекты динамически, в зависимости от выбранных значений.
```js
dynamic: [
  {
    when: ['ru'],
    create: {
      mount(parent) {  // не обязателен. Переопределяет дефолтный mount
        const el = document.createElement('div');
        parent.appendChild(el);
        return el;
      },
      config: {  // такой же конфиг, как и для обычног CustomSelect. Поддверживает вложенные dynamic
        placeholder: 'Выберите город',
        options: [
          { label: 'Москва', key: 'msk' },
          { label: 'СПб', key: 'spb' }
        ]
      }
    }
  }
]
```

---

## 🧠 Классы (classes)
Позволяет добавить CSS-классы. Все свойства принимают массив строк или строку
```js
classes: {
    inner: 'my-inner',
    value: ['my-value', 'rounded'], 
    dropdown: 'my-dropdown',
    placeholder: 'my-placeholder',
    arrow: 'my-arrow',
    search: 'my-search',
    selected: 'my-selected',
    options: 'my-option',
}
```

---

## 🛠 Методы экземпляра

- getValue()
- setValue(value)
- clear()
- addOptions(options)
- removeOption(id)
- open()
- close()
- toggle()
- destroy()
