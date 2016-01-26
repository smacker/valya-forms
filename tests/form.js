import test from 'tape';
import { renderOnce } from './helpers';

import { FormWrapper } from '../src/index';

const fieldName = 'test';
let output, instance, childContext;

function makeForm(props) {
    const component = () => null;
    const wrappedComponent = FormWrapper(component);

    ({ output, instance } = renderOnce({
        component: wrappedComponent,
        props
    }));

    childContext = instance.getChildContext();
}

test('child context', (t) => {
    makeForm();

    t.true(
        typeof childContext.onStart === 'function',
        'onStart callback should be function'
    );

    t.true(
        typeof childContext.onEnd === 'function',
        'onStart callback should be function'
    );

    t.equal(childContext.initialValidation, false);
    t.equal(childContext.silentInitValidation, false);

    t.end();
});

test('set child props', (t) => {
    makeForm();

    const keys = [
        'initialValidation', 'silentInitValidation',
        'isValid', 'isValidating'
    ];

    keys.forEach((key) => {
        t.true(key in output.props, `${key} is in props`);
    });

    t.end();
});

test('default state', (t) => {
    makeForm();

    t.deepEqual(instance.state, {
        isValid: false,
        isValidating: false
    });

    t.end();
});

test('state change after onStart', (t) => {
    makeForm();

    childContext.onStart(fieldName);

    t.deepEqual(instance.state, {
        isValid: false,
        isValidating: true
    });

    t.end();
});

test('state change after valid onEnd', (t) => {
    makeForm();

    const isValid = true;
    const message = null;

    childContext.onStart(fieldName);
    childContext.onEnd(isValid, message, fieldName);

    t.deepEqual(instance.state, {
        isValid: true,
        isValidating: false
    });

    t.end();
});

test('state change after not valid onEnd', (t) => {
    makeForm();

    const isValid = false;
    const message = 'error';

    childContext.onStart(fieldName);
    childContext.onEnd(isValid, message, fieldName);

    t.deepEqual(instance.state, {
        isValid: false,
        isValidating: false
    });

    t.end();
});

test('should finish validation when onEnd called more times then onStart', (t) => {
    makeForm();

    const isValid = true;
    const message = null;

    childContext.onEnd(isValid, message, fieldName);

    t.deepEqual(instance.state, {
        isValid: true,
        isValidating: false
    });

    t.end();
});
