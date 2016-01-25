import { Component, PropTypes, createElement } from 'react';

export const ValidatorWrapper = (Base) => {
    return class extends Component {
        static contextTypes = {
            onStart: PropTypes.func,
            onEnd: PropTypes.func,
            initialValidation: PropTypes.bool,
            silentInitValidation: PropTypes.bool
        };

        _onStart = () => {
            if (!this.context.onStart) {
                return;
            }

            this.context.onStart(this.props.name);
        };

        _onEnd = (isValid, message) => {
            if (!this.context.onEnd) {
                return;
            }

            this.context.onEnd(isValid, message, this.props.name);
        };

        render() {
            const { initialValidation, silentInitValidation } = this.context;

            return createElement(Base, {
                initialValidation,
                silentInitValidation,
                onStart: this._onStart,
                onEnd: this._onEnd,
                ...this.props
            }, this.props.children);
        }
    };
};

export const FormWrapper = (Base) => {
    return class extends Component {
        static defaultProps = {
            initialValidation: false,
            silentInitValidation: false
        };

        constructor(props, context) {
            super(props, context);

            this.state = {
                isValid: false,
                isValidating: false
            };

            this.fieldsInValidating = 0;
            this.fields = {};
        }

        static childContextTypes = {
            onStart: PropTypes.func,
            onEnd: PropTypes.func,
            initialValidation: PropTypes.bool,
            silentInitValidation: PropTypes.bool
        };

        getChildContext() {
            const { initialValidation, silentInitValidation } = this.props;

            return {
                onStart: (name) => {
                    this.fieldsInValidating += 1;
                    this.fields[name] = false;
                    this.setState({ isValid: false, isValidating: true });
                },
                onEnd: (isValid, message, name) => {
                    this.fieldsInValidating -= 1;
                    this.fields[name] = isValid;

                    if (this.fieldsInValidating === 0) {
                        this.setState({
                            isValid: Object.keys(this.fields).reduce((result, next) => {
                                return result && this.fields[next];
                            }, true),
                            isValidating: false
                        });
                    }
                },
                initialValidation,
                silentInitValidation
            };
        }

        render() {
            return createElement(Base, {
                ...this.props,
                ...this.state
            }, this.props.children);
        }
    };
};
