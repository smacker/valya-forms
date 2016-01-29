import React from 'react';
import { FormWrapper } from '../../src/index';
import Validator from './validator';

class Form extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            value: props.value
        };

        this._onValueChange = this._onValueChange.bind(this);
    }

    _onValueChange = (e) => {
        this.setState({
            value: e.target.value
        });
    };

    render() {
        let { isValid, isValidating, validators } = this.props;

        return (
            <form initialValidation={false}>
                <Validator name="value" value={this.state.value} validators={validators}>
                    <input onChange={this._onValueChange} />
                </Validator>
                <div className="isValidating">{isValidating ? 'validating' : null}</div>
                <div className="isValid">{isValid ? 'valid' : 'invalid'}</div>
            </form>
        );
    }
}

export default FormWrapper(Form);
