import 'babel-polyfill';

import React from 'react';
import test from 'tape';

import TestUtils from 'react-addons-test-utils';
import Form from './components/form';

const LONG_TIMEOUT = 100;
const validators = [
    {
        validator(value) {
            if (value === 'reject-me') {
                return Promise.reject();
            }

            if (value === 'long-operation') {
                return new Promise((resolve) => {
                    setTimeout(resolve, LONG_TIMEOUT);
                });
            }

            return Promise.resolve();
        }
    }
];

function getForm(props) {
    return TestUtils.renderIntoDocument(<Form validators={validators} {...props} />);
}

function getState(form) {
    const isValidNode = TestUtils.findRenderedDOMComponentWithClass(form, 'isValid');
    const isValidatingNode = TestUtils.findRenderedDOMComponentWithClass(form, 'isValidating');

    return {
        isValid: isValidNode.textContent === 'valid',
        isValidating: isValidatingNode.textContent === 'validating'
    };
}

function waitValidation({ long: long = false } = {}) {
    // just wait until next tick or custom timeout
    return new Promise((resolve) => {
        setTimeout(resolve, long ? (LONG_TIMEOUT + 1) : 0);
    });
}

// base case

test('form initial', (t) => {
    const {isValid, isValidating} = getState(getForm());

    t.false(isValid, 'should be invalid');
    t.false(isValidating, 'should not be in validating');

    t.end();
});

test('form valid', (t) => {
    const form = getForm();
    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'input');

    TestUtils.Simulate.change(input, {target : {value: 'valid'}});

    waitValidation().then(() => {
        const {isValid, isValidating} = getState(form);

        t.true(isValid, 'should be valid');
        t.false(isValidating, 'should not be in validating');

        t.end();
    });
});

test('form invalid', (t) => {
    const form = getForm();
    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'input');

    TestUtils.Simulate.change(input, {target : {value: 'reject-me'}});

    waitValidation().then(() => {
        const {isValid, isValidating} = getState(form);

        t.false(isValid, 'should be invalid');
        t.false(isValidating, 'should not be in validating');

        t.end();
    });
});

test('form long operation', (t) => {
    const form = getForm();
    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'input');

    TestUtils.Simulate.change(input, {target : {value: 'long-operation'}});

    waitValidation().then(() => {
        const {isValid, isValidating} = getState(form);

        t.false(isValid, 'should be invalid');
        t.true(isValidating, 'should be in validating');
    });

    waitValidation({long: true}).then(() => {
        const {isValid, isValidating} = getState(form);

        t.true(isValid, 'should be valid');
        t.false(isValidating, 'should not be in validating');

        t.end();
    });
});

// initialValidation case

test('form initial render with initialValidation', (t) => {
    const form = getForm({initialValidation: true});
    let {isValid, isValidating} = getState(form);

    t.false(isValid, 'should be invalid');
    t.true(isValidating, 'should be in validating');

    waitValidation().then(() => {
        ({isValid, isValidating} = getState(form));

        t.true(isValid, 'should be valid');
        t.false(isValidating, 'should not be in validating');

        t.end();
    });
});

test('form initial render with initialValidation', (t) => {
    const form = getForm({initialValidation: true, value: 'reject-me'});
    let {isValid, isValidating} = getState(form);

    t.false(isValid, 'should be invalid');
    t.true(isValidating, 'should be in validating');

    waitValidation().then(() => {
        ({isValid, isValidating} = getState(form));

        t.false(isValid, 'should be invalid');
        t.false(isValidating, 'should not be in validating');

        t.end();
    });
});
