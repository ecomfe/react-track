import React from 'react';
import PropTypes from 'prop-types';
import {noop} from 'lodash';

export default class Select extends React.PureComponent {
    static propTypes = {
        defaultValue: PropTypes.string.isRequired,
        options: PropTypes.array.isRequired,
        onChange: PropTypes.func
    };

    static defaultProps = {
        onChange: noop
    };

    constructor(props) {
        super(props);

        this.state = {
            value: props.defaultValue
        };
    }

    handleChange = event => {
        const value = event.target.value;

        this.setState({value});
        this.props.onChange(value);
    };

    handleClick = () => {
        this.props.onClick();
    }

    render() {
        const {options} = this.props;

        return (
            <select value={this.state.value} onChange={this.handleChange} onClick={this.handleClick} >
                {options.map(option => (
                    <option key={option.value} value={option.value} >
                        {option.name}
                    </option>
                ))}
            </select>
        );
    }
}
