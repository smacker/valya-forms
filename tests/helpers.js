import React from 'react';
import TestUtils from 'react-addons-test-utils';

export function createRender(context = {}) {
    const shallowRenderer = TestUtils.createRenderer();

    return function({ component, props }) {
        shallowRenderer.render(
            React.createElement(
                component,
                props
            ),
            context
        );

        const output = shallowRenderer.getRenderOutput();
        const instance = shallowRenderer._instance._instance;

        return { output, instance };
    };
}

export function renderOnce({ context, ...args }) {
    return createRender(context)(args);
}
