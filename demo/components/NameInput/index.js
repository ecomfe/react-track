import {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {noop} from 'lodash';
import {trackEvent} from '../../../src';

const Input = trackEvent({
    eventPropName: 'onChange',
    category: 'input',
    action: 'change',
    label: 'Name',
})('input');

export default class NameInput extends PureComponent {
    static propTypes = {
        onNameChange: PropTypes.func,
    };

    static defaultProps = {
        onNameChange: noop,
    };

    constructor(props) {
        super(props);

        this.state = {
            value: '',
        };
    }

    handleChange = event => {
        const value = event.target.value;

        this.setState({value});
        this.props.onNameChange(value);
    };

    render() {
        return (
            <Input onChange={this.handleChange} />
        );
    }
}
