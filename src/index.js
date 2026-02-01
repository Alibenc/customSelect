import { CustomSelect } from './core/CustomSelect.js';
export default CustomSelect;


// здесь тестируем инициализацию в режиме разработки, перед билдом - удалить

// const select = new CustomSelect({
//     selector: '#mySelect',
//     // multi: true,
//     searchable: true,
//     allowCustom: true,
//     placeholder: 'Выберите или введите значение',
//     options: [
//         { label: 'JavaScript' },
//         { id: '2', label: 'TypeScript', key: 'ts' },
//         { id: '3', label: 'Python' },
//         { id: '4', label: 'Go' }
//     ],
//     renderers: {
//         // renderOption(option) {
//         //     return `
//         //         <span style="display:flex;justify-content:space-between">
//         //           <span>${option.label}</span>
//         //           <small>#${option.id}</small>
//         //         </span>
//         //       `;
//         // },
//
//         renderSelectedOption(option) {
//             return `<strong>${option.label}</strong>`;
//         }
//     },
//
//     /* события */
//     events: {
//         onChange(options) {
//             console.log('onChange:', options);
//
//             // if (options[0]) {
//             //     setTimeout(() => {
//             //         select.removeOption(options[0].id);
//             //     }, 2000)
//             // }
//         },
//
//         onSelect(option) {
//             console.log('onSelect:', option);
//         },
//
//         onDeselect(option) {
//             console.log('onDeselect:', option);
//         },
//
//         onCustomOption(option) {
//             console.log('onCustomOption:', option);
//         },
//
//         onOpen() {
//             console.log('onOpen');
//         },
//
//         onClose() {
//             console.log('onClose');
//         },
//
//         onFocus() {
//             console.log('onFocus');
//         },
//
//         onBlur() {
//             console.log('onBlur');
//         }
//     }
// });

// select.addOptions([
//     { label: 'php' },
//     { label: 'C++' }
// ])
// // console.log(select.options);
//
// select.addOptions([
//     { label: 'C#' },
//     { label: 'Java' }
// ])
// console.log(select.options);



// const jsonConfig = `
//     {
//       "selector": "#myJSONSelect",
//       "multi": true,
//       "searchable": true,
//       "placeholder": "Выберите значение",
//       "allowCustom": true,
//
//       "options": [
//         { "id": "1876", "label": "JavaScript" },
//         { "id": "2456", "label": "TypeScript" }
//       ],
//
//       "events": {
//         "onChange": "function(value) { console.log('change JSON', value); }",
//         "onSelect": "function(option) { console.log('select JSON', option); }"
//       },
//
//       "renderers": {
//         "renderOption": "function(option) { return '<span>' + option.label + '</span>'; }",
//         "renderSelectedOption": "function(option) { return '<b>' + option.label + '</b>'; }"
//       }
//     }
// `;
//
// const jsonSelect = new CustomSelect(jsonConfig);
// console.log(jsonSelect)


const selectDynamic = new CustomSelect({
    selector: '#country',
    multi: true,
    searchable: true,
    // allowCustom: true,
    placeholder: 'Выберите страну',
    options: [
        { label: 'Россия', key: 'ru', data: {test: 'true'} },
        { label: 'Беларусь', key: 'be' },
        { label: 'Казахстан', key: 'kz', data: {test: 'true'} },
        { label: 'Великобритания', key: 'uk', }
    ],
    classes: {
        inner: 'my-inner',
        value: ['my-value', 'rounded'],
        dropdown: 'my-dropdown',
        placeholder: 'my-placeholder',
        arrow: 'my-arrow',
        search: 'my-search',
        selected: 'my-selected',
        options: 'my-option',
    },
    events: {
        // onChange(options) {
        //     console.log('onChange:', options);
        // },
        // onSelect(option) {
        //     console.log('onSelect:', option);
        // },
        // onDeselect(option) {
        //     console.log('onDeselect:', option);
        // },
        // onFocus() {
        //     console.log('onFocus');
        // },
        // onBlur() {
        //     console.log('onBlur');
        // }
        // onOpen() {
        //     console.log('onOpen');
        // },
        // onClose() {
        //     console.log('onClose');
        // },
        // onCustomOption(option) {
        //     console.log('onCustomOption:', option);
        // },
    },
    dynamic: [
        {
            when: ['ru'],
            create: {
                config: {
                    options: [
                        { label: 'Москва', key: 'msk' },
                        { label: 'СПб', key: 'spb' }
                    ],
                    allowCustom: true,
                    searchable: true,
                    dynamic: [
                        {
                            when: ['msk'],
                            create: {
                                config: {
                                    options: [
                                        { label: 'Центр', key: 'center' }
                                    ]
                                }
                            }
                        }
                    ]
                }
            }
        },
        {
            when: ['ru'],
            create: {
                config: {
                    options: [
                        { label: 'test', key: 'sdfgh' },
                        { label: 'test2', key: 'sdfgh' }
                    ],
                }
            }
        }
    ]
});
