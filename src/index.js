import { CustomSelect } from './core/CustomSelect.js';
export default CustomSelect;


// здесь тестируем инициализацию в режиме разработки, перед билдом - удалить

// const selectDynamic = new CustomSelect({
//     selector: '#country',
//     multi: true,
//     searchable: true,
//     allowCustom: true,
//     placeholder: 'Выберите страну',
//     options: [
//         { label: 'Россия', key: 'ru', data: {test: 'true'} },
//         { label: 'Беларусь', key: 'be' },
//         { label: 'Казахстан', key: 'kz', data: {test: 'true'} },
//         { label: 'Великобритания', key: 'uk', }
//     ],
//     classes: {
//         inner: 'my-inner',
//         value: ['my-value', 'rounded'],
//         dropdown: 'my-dropdown',
//         placeholder: 'my-placeholder',
//         arrow: 'my-arrow',
//         search: 'my-search',
//         selected: 'my-selected',
//         options: 'my-option',
//     },
//     events: {
//         onChange(options) {
//             console.log('onChange:', options);
//         },
//         onSelect(option) {
//             console.log('onSelect:', option);
//         },
//         onDeselect(option) {
//             console.log('onDeselect:', option);
//         },
//         onFocus() {
//             console.log('onFocus');
//         },
//         onBlur() {
//             console.log('onBlur');
//         },
//         onOpen() {
//             console.log('onOpen');
//         },
//         onClose() {
//             console.log('onClose');
//         },
//         onCustomOption(option) {
//             console.log('onCustomOption:', option);
//         },
//     },
//     dynamic: [
//         {
//             when: ['ru'],
//             create: {
//                 config: {
//                     options: [
//                         { label: 'Москва', key: 'msk' },
//                         { label: 'СПб', key: 'spb' }
//                     ],
//                     allowCustom: true,
//                     searchable: true,
//                     dynamic: [
//                         {
//                             when: ['msk'],
//                             create: {
//                                 config: {
//                                     options: [
//                                         { label: 'Центр', key: 'center' }
//                                     ]
//                                 }
//                             }
//                         }
//                     ]
//                 }
//             }
//         },
//         {
//             when: ['ru'],
//             create: {
//                 config: {
//                     options: [
//                         { label: 'test', key: 'sdfgh' },
//                         { label: 'test2', key: 'sdfgh' }
//                     ],
//                 }
//             }
//         }
//     ]
// });


const jsonDynamicConfig = `{
    "selector": "#country",
    "multi": true,
    "searchable": true,
    "allowCustom": true,
    "placeholder": "Выберите страну",

    "options": [
        {
            "label": "Россия",
            "key": "ru",
            "data": { "test": "true" }
        },
        {
            "label": "Беларусь",
            "active": true,
            "key": "be"
        },
        {
            "label": "Казахстан",
            "key": "kz",
            "data": { "test": "true" }
        },
        {
            "label": "Великобритания",
            "key": "uk"
        }
    ],

    "classes": {
        "inner": "my-inner",
        "value": ["my-value", "rounded"],
        "dropdown": "my-dropdown",
        "placeholder": "my-placeholder",
        "arrow": "my-arrow",
        "search": "my-search",
        "selected": "my-selected",
        "option": "my-option"
    },

    "events": {
        "onChange": "function(options) { console.log('onChange:', options); }",
        "onSelect": "function(option) { console.log('onSelect:', option); }",
        "onDeselect": "function(option) { console.log('onDeselect:', option); }",
        "onFocus": "function() { console.log('onFocus'); }",
        "onBlur": "function() { console.log('onBlur'); }",
        "onOpen": "function() { console.log('onOpen'); }",
        "onClose": "function() { console.log('onClose'); }",
        "onCustomOption": "function(option) { console.log('onCustomOption:', option); }"
    },

    "dynamic": [
        {
            "when": ["ru"],
            "create": {
                "mount": "function(parent) { \
                  var el = document.createElement('div'); \
                  el.className = 'dynamic-select'; \
                  parent.appendChild(el); \
                  return el; \
                }",
                "config": {
                    "options": [
                        { "label": "Москва", "key": "msk" },
                        { "label": "СПб", "key": "spb" }
                    ],

                    "allowCustom": true,
                    "searchable": true,
                    "dynamic": [
                        {
                            "when": ["msk"],
                            "create": {
                                "config": {
                                    "options": [
                                        { "label": "Центр", "key": "center" }
                                    ]
                                }
                            }
                        }
                    ]
                }
            }
        },
        {
            "when": ["ru"],
            "create": {
                "config": {
                    "options": [
                        { "label": "test", "key": "sdfgh" },
                        { "label": "test2", "key": "sdfgh" }
                    ]
                }
            }
        }
    ]
}`

const jsonDynamicSelect = new CustomSelect(jsonDynamicConfig);

console.log(jsonDynamicSelect)
