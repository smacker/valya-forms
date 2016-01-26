import test from 'tape';
import { renderOnce } from './helpers';

import { ValidatorWrapper } from '../src/index';

let output, instance;

function makeValidator(context) {
    const component = () => null;
    const wrappedComponent = ValidatorWrapper(component);

    ({ output, instance } = renderOnce({
        component: wrappedComponent,
        props: {
            name: 'test'
        },
        context
    }));
}

test('should set onStart and onEnd props', (t) => {
    makeValidator();

    t.true(
        typeof output.props.onStart === 'function',
        'onStart callback should be function'
    );

    t.true(
        typeof output.props.onEnd === 'function',
        'onEnd callback should be function'
    );

    t.equal(output.props.onStart, instance._onStart);
    t.equal(output.props.onEnd, instance._onEnd);

    t.end();
});

test('should pass initialValidation from context to props', (t) => {
    makeValidator({initialValidation: true});

    t.equal(output.props.initialValidation, true);

    t.end();
});

test('should pass silentInitValidation from context to props', (t) => {
    makeValidator({silentInitValidation: true});

    t.equal(output.props.silentInitValidation, true);

    t.end();
});

test('should call onStart from context', (t) => {
    function callback() {
        t.pass('callback called');
        t.end();
    }

    makeValidator({onStart: callback});

    output.props.onStart();
});

test('should call onEnd from context', (t) => {
    function callback() {
        t.pass('callback called');
        t.end();
    }

    makeValidator({onEnd: callback});

    output.props.onEnd();
});
