# JS-Validator

## Overview

Validation of diffent types of ***inputs*** (text, email, tel, password, radio, date), ***textarea*** and ***select*** with require.

***
## Params: 
```
{
    lang: 'ru',
    selectors: {
        parrentBlock: '.row-input',
        errorBlock: '.help-block-error'
        errorClassPlace: '.row-input',
        errorClass: 'has-error'
        forms: 'form' 
    }
}

```
***lang*** - string, default 'ru', may be also 'ua'.

***selectors*** - object, default:
```
{
    'parrentBlock': '.row-input',
    'errorBlock': '.form__error',
    'errorClassPlace': '.row-input',
    'errorClass': 'error__field',
    'forms': 'form'
}
```
***parrentBlock*** - string, the parent block of the form element. **Selector!**

***errorBlock*** - string, block for placing an error message. **Selector!**

***errorClassPlace*** - string, place where errorClass will be added. **Selector!**      

***errorClass*** - string, form element error styling class. **Class!**

***forms*** - string, forms to which validation will be applied. **Selector!** 

***

## Init validation example:

```
let validation = new Validation();

validation.addEvents();
```
***

## Init validation example with params:

```
let validation = new Validation({
    lang: 'ua',
    selectors: {
        'parrentBlock': '.row-input',
        'errorBlock': '.help-block-error',
        'errorClassPlace': '.row-input',
        'errorClass': 'has-error',
        'forms': 'form'
    }
});

validation.addEvents();
```