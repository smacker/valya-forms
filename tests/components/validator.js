import React from 'react';
import Valya from 'valya';
import { ValidatorWrapper } from '../../src/index';

class Validator extends React.Component {
    renderError() {
        const { enabled, isValid } = this.props;

        if (!enabled || isValid) {
            return null;
        }

        return <div className="error">{this.props.validationMessage}</div>;
    }

    render() {
        return (
            <div className="validator">
                <div className="target">{this.props.children}</div>
                {this.renderError()}
            </div>
        );
    }
}

export default ValidatorWrapper(Valya(Validator));
