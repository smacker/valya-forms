import { Component, PropTypes, createElement } from 'react';

export const ValidatorWrapper = (Base) => {
    return class extends Component {
        static contextTypes = {
            onStart: PropTypes.func,
            onEnd: PropTypes.func,
            initialValidation: PropTypes.bool
        };

        _onStart = (props) => {
            this.props.onStart && this.props.onStart(props);
            this.context.onStart && this.context.onStart(props);
        };

        _onEnd = (props) => {
            this.props.onEnd && this.props.onEnd(props);
            this.context.onEnd && this.context.onEnd(props);
        };

        render() {
            const { initialValidation } = this.context;

            return createElement(Base, {
                initialValidation,
                ...this.props,
                onStart: this._onStart,
                onEnd: this._onEnd
            }, this.props.children);
        }
    };
};

export const FormWrapper = (Base) => {
    return class extends Component {
        static defaultProps = {
            initialValidation: false
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
            initialValidation: PropTypes.bool
        };

        getChildContext() {
            const { initialValidation } = this.props;

            return {
                onStart: ({ name }) => {
                    this.fieldsInValidating += 1;
                    this.fields[name] = false;
                    this.setState({ isValid: false, isValidating: true });
                },
                onEnd: ({ isValid, name }) => {
                    this.fieldsInValidating -= 1;
                    this.fields[name] = isValid;

                    if (this.fieldsInValidating < 0) {
                        this.fieldsInValidating = 0;
                    }

                    if (this.fieldsInValidating === 0) {
                        this.setState({
                            isValid: Object.keys(this.fields).reduce((result, next) => {
                                return result && this.fields[next];
                            }, true),
                            isValidating: false
                        });
                    }
                },
                initialValidation
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
