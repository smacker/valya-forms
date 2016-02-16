# Valya Forms

Valya Forms are just a tiny Higher-Order Components for [Valya](https://github.com/deepsweet/valya).

It provides props `isValid` and `isValidating` for wrapped component according to states of validators.
Also it allows set `initialValidation` in form for all validators of this form.

### Example

First we need to create valya validator and return it in wrapper:

```js
import { Component } from 'react';
import { ValidatorWrapper } from 'valya-forms';
import Valya from 'valya';

class Validator extends Component {
    renderError() {
        const { shouldValidate, isValid } = this.props;

        if (!shouldValidate || isValid) {
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

// This is only change
// We export not Valya(Validator) but ValidatorWrapper(Valya(Validator))
export default ValidatorWrapper(Valya(Validator));
```

Then we create form and wrap it too:

```js
import { Component } from 'react';
import { FormWrapper } from 'valya-forms';
import Validator from './validator';

// simple react form component
class MyForm extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            email: props.email
        };

        this._onEmailChange = this._onEmailChange.bind(this);
    }

    _onEmailChange = (e) => {
        this.setState({
            email: e.target.value
        });
    };

    render() {
        // injected props by wrapper
        let { isValid, isValidating } = this.props;

        return (
            {/* prop initialValidation will be passed to all validators */}
            <form initialValidation={true}>
                {/* name & value props are required
                    they will be passed to valya and underlying component */}
                <Validator name="email" value={this.state.email} validators={validators}>
                    <input onBlur={this._onEmailChange} />
                </Validator>
                <div>{isValidating ? 'processing validation' : 'validation finished'}</div>
                <div>Form is {isValid ? 'valid' : 'invalid'}</div>
            </form>
        );
    }
}

// export form in wrapper
export default FormWrapper(MyForm);
```
