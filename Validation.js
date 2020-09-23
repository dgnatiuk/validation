/**
 *
 * @constructor
 * @name Validation
 *
 * Для валидации форм необходимо задать определенные селекторы элементов формы, соответствующие сообщения об ошибках и
 * вызвать объект валидации через new Validation().
 */

function Validation(params) {
    let self = this;
    let lang = params && params.lang === 'ua' ? params.lang : 'ru';

    /**
     * Сообщения об разничных типах ошибок
     *
     * @type {object}
     *
     * @property {string} emptyText - Пустое текстовое поле.
     * @property {string} emptyEmail - Пустое поле ввода email.
     * @property {string} emptyTel - Пустое поле ввода телефонного номера.
     * @property {string} emptyPassword - Пустое поле ввода пароля.
     * @property {string} emptyDate - Пустое поле ввода даты.
     * @property {string} shortText - Короткое содержимое текстового поля.
     * @property {string} shortEmail - Короткое содержимое поля ввода email.
     * @property {string} shortPassword - Короткое содержимое поля ввода пароля.
     * @property {string} invalidEmail - Некорректное содержимое поля ввода email.
     * @property {string} invalidText - Некорректное содержимое текстового поля.
     * @property {string} invalidDate - Некорректное содержимое поля ввода даты.
     * @property {string} invalidTel - Некорректное содержимое поля ввода телефонного номера.
     * @property {string} invalidPassword - Некорректное содержимое поля ввода пароля.
     */
    this.errors = {
        'emptyText': lang === 'ua' ? 'Введіть текст' : 'Введите текст',
        'emptyEmail': lang === 'ua' ? 'Введіть email' : 'Введите email',
        'emptyTel': lang === 'ua' ? 'Введіть номер телефону' : 'Введите номер телефона',
        'emptyPassword': lang === 'ua' ? 'Введіть пароль' : 'Введите пароль',
        'emptyDate': lang === 'ua' ? 'Заповніть дату' : 'Введите дату',
        'shortText': lang === 'ua' ? 'Занадто короткий текст' : 'Слишком короткий текст',
        'shortEmail': lang === 'ua' ? 'Некоректний email' : 'Некорректный email',
        'shortPassword': lang === 'ua' ? 'Некоректний пароль' : 'Некорректный пароль',
        'invalidEmail': lang === 'ua' ? 'Помилка в email' : 'Невалидный email',
        'invalidDate': lang === 'ua' ? 'Помилка в даті' : 'Невалидная дата',
        'invalidText': lang === 'ua' ? 'Невалідний текст' : 'Невалидный текст',
        'invalidPassword': lang === 'ua' ? 'Невалідний пароль' : 'Невалидный пароль',
        'invalidTel': lang === 'ua' ? 'Невалідний номер телефону' : 'Невалидный номер телефона',
        'requiredList': lang === 'ua' ? 'Оберіть значення' : 'Выберите значение'
    };

    /**
     * Определенные селекторы формы.
     * @type {object}
     *
     * @property {string} parrentBlock - Родительский блок элемента формы.
     * @property {string} errorBlock - Блок для размещения сообщения об ошибке.
     * @property {string} errorClass - Класс стилизации ошибки элемента формы.
     * @property {string} errorClassPlace - Место куда будет добавлен errorClass.
     * @property {string} forms - Формы к которым будет применяться валидация.
     */
    this.selectors = {
        'parrentBlock': '.row-input',
        'errorBlock': '.form__error',
        'errorClass': 'error__field',
        'errorClassPlace': '.row-input',
        'forms': 'form'
    };


    /**
     * Установка селекторов из params.
     */
    this.setSelectors = function () {
        for (key in params){
            if (this.selectors[key]) this.selectors[key] = params.selectors[key];
        }
    }

    /**
     * Добавляет сообщение об ошибке.
     *
     * @param {object} target - Элемент для размещения ошибки.
     * @param {string} errorMessage - Сообщение об ошибке.
     */
    this.addError = function (target, errorMessage) {
        let errorBox = target.closest(this.selectors.parrentBlock).querySelector(this.selectors.errorBlock);

        if (errorBox.innerText === '') {
            errorBox.innerText = this.errors[errorMessage] ? this.errors[errorMessage] : errorMessage;
        }

        target.closest(this.selectors.errorClassPlace).classList.add(this.selectors.errorClass);
    };

    /**
     * @param {object} target - Элемент в котором нужно удалить сообщение об ошибке.
     * Удаляет сообщение об ошибке.
     *
     */
    this.removeError = function (target) {
        target.closest(this.selectors.errorClassPlace).classList.remove(this.selectors.errorClass);
    };

    this.addEvents = function () {
        document.querySelectorAll(this.selectors.forms).forEach(form => {
            /**
             * Проверка формы на наличие аттрибута novalidate.
             */
            if (form.getAttribute('novalidate') === undefined) {
                form.setAttribute('novalidate', true);
            };


            form.querySelectorAll('input:not([type=hidden]), textarea, select').forEach(el => {
                /**
                 *  Убирает ошибки в поле при фокусе на нем.
                 */
                el.addEventListener('focus', () => self.removeError(el));

                /**
                 *  Убирает ошибки в поле при вводе, если после submit у нас остался фокус в поле.
                 */
                el.addEventListener('input', () => self.removeError(el));

                /**
                 *  Проверка на валидность определенного поля при уходе из него фокуса.
                 */
                el.addEventListener('blur', () => {
                    if (el.value !== '') {
                        self.validFormElements(el);
                    } else {
                        self.removeError(el);
                    }
                });
            })

            form.querySelectorAll('input[type=radio], select').forEach(el => {
                /**
                 *  Убирает ошибки при изминении select, radio.
                 */
                el.addEventListener('change', () => self.removeError(el));
            })

            /**
             * Проверка валидности элементов формы при submit
             */
            form.addEventListener('submit', function () {
                let formValid = true;

                this.querySelectorAll('input:not([type=hidden]), textarea, select').forEach(item => {
                    if (!self.validFormElements(item)) formValid = false;
                })

                if (formValid) console.log('Validation is fine');
                return formValid;
            })
        })

        this.setSelectors();
    };


    /**
     * Проверка на валидность элементов формы
     *
     * @param target - Элемент формы, который будет проверяться на валидность.
     */
    this.validFormElements = function (target) {
        let valid = true;

        if (!target.validity.valid) {
            let type;
            if (target.tagName === 'TEXTAREA') {
                type = 'text';
            } else if (target.tagName === 'SELECT') {
                type = 'list';
            } else if (target.tagName === 'INPUT') {
                type = target.type === 'radio' ? 'list' : target.getAttribute('type');
            }

            try {
                type = type.charAt(0).toUpperCase() + type.substr(1);
                self['valid' + type](target);
            } catch (e) {
                console.error(`Validator error:${e.message}`)
            }

            valid = false;
        }

        return valid;
    };

    /**
     * Проверяет валидность поля для вводу текстовой информации.
     *
     * @param {object} target - Поле которое проверяется на валидность.
     */
    this.validText = function (target) {
        if (target.validity.valueMissing) {
            self.addError(target, 'emptyText');
        } else if (target.validity.tooShort) {
            self.addError(target, 'shortText');
        } else if (target.validity.patternMismatch) {
            self.addError(target, 'invalidText');
        } else if (target.validity.typeMismatch) {
            self.addError(target, 'invalidText');
        }
    };

    /**
     * Проверяет валидность поля для ввода электронного адреса.
     *
     * @param {object} target - Поле которое проверяется на валидность.
     */
    this.validEmail = function (target) {
        if (target.validity.valueMissing) {
            self.addError(target, 'emptyEmail');
        } else if (target.validity.tooShort) {
            self.addError(target, 'shortEmail');
        } else if (target.validity.typeMismatch) {
            self.addError(target, 'invalidEmail');
        } else if (target.validity.patternMismatch) {
            self.addError(target, 'invalidEmail');
        }
    };

    /**
     * Проверяет валидность поля для ввода телефонного номера.
     *
     * @param {object} target - Поле которое проверяется на валидость.
     */
    this.validTel = function (target) {
        if (target.validity.valueMissing) {
            self.addError(target, 'emptyTel');
        } else if (target.validity.typeMismatch) {
            self.addError(target, 'invalidTel');
        } else if (target.validity.patternMismatch) {
            self.addError(target, 'invalidTel');
        }
    };

    /**
     * Проверяет валидность поля для пароля.
     *
     * @param {object} target - Поле которое проверяется на валидость.
     */
    this.validPassword = function (target) {
        if (target.validity.valueMissing) {
            self.addError(target, 'emptyPassword');
        } else if (target.validity.tooShort) {
            self.addError(target, 'shortPassword');
        } else if (target.validity.typeMismatch) {
            self.addError(target, 'invalidPassword');
        } else if (target.validity.patternMismatch) {
            self.addError(target, 'invalidPassword');
        }
    };

    /**
     * Проверяет валидность поля для селекта или радиобатона.
     *
     * @param {object} target - Поле которое проверяется на валидость.
     */
    this.validList = function (target) {
        self.addError(target, 'requiredList');
    };

    /**
     * Проверяет валидность поля для даты.
     *
     * @param {object} target - Поле которое проверяется на валидость.
     */
    this.validDate = function (target) {
        if (target.validity.badInput) {
            self.addError(target, 'invalidDate');
        } else if (target.validity.valueMissing) {
            self.addError(target, 'emptyDate');
        }
    };

}