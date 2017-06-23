import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

import Btn from '../Btn';

const INPUT_PROPS = ['name', 'disabled', 'min', 'max', 'autoFocus', 'tabIndex'];

class FormFieldNumber extends Component {

  state = {
    touched: false,
    focused: false,
    error: null,
  }

  componentWillMount () {
    this.setPropsToState(this.props);
  }

  componentWillReceiveProps (nextProps) {
    this.setPropsToState(nextProps);
  }

  setPropsToState = (props) => {
    let val = Number(props.value);
    this.setState(({ touched }) => ({
      val,
      id: props.id || props.name && 'ff-number-' + props.name,
      ...(props.touched ? { touched: true } : {}),
      ...(touched || props.touched ? this.validate(val, false) : {}),
    }));
  }

  clamp = (val) => {
    let { min, max } = this.props;
    if (typeof min !== 'undefined' && val < min) {
      val = Number(min);
    }
    if (typeof max !== 'undefined' && val > max) {
      val = Number(max);
    }
    return val;
  }

  handleChange = (ev, val) => {
    let { error, focused } = this.state;
    let isValProvided = typeof val === 'number';
    val = this.clamp(
      isValProvided ? val : Number(ev.target.value.replace(/[^0-9]/g, ''))
    );

    this.setState({
      val,
      ...(isValProvided ? { touched: true } : {}),
      ...(!focused || error && focused ? this.validate(val, false) : {}),
    });
    this.triggerOnChange(val);
  }

  handleFocus = (ev) => {
    this.setState({ focused: true });
    this.props.onFocus(ev);
  }

  handleBlur = (ev) => {
    this.setState(({ val }) => ({
      focused: false, touched: true, ...this.validate(val, false),
    }));
    this.props.onBlur(ev);
  }

  triggerOnChange = _debounce((...args) => {
    this.props.onChange(...args); // call the fresh prop
  }, this.props.debounce)

  /*
   * @public
   */
  validate = (val = this.state.val, updateState = true) => {
    let error = this.props.validation(val) || null;
    if (updateState) {
      this.setState({ error });
    }
    return { error };
  }

  render () {
    let { className, style, label, disabled, size } = this.props;
    let { id, val, error, focused } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += error ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';
    return (
      <div className={'FormField FormField--number ' + className} style={style}>
        {typeof label !== 'undefined' &&
          <label className="FormField-label" htmlFor={id}>{label}</label>
        }
        <div className="FormField-field">
          <input id={id} className="FormField-control" type="number" pattern="[0-9]*"
            style={{ width: `calc(${size}ch + 2em)` }} autoComplete="off"
            value={val}
            {..._pick(this.props, INPUT_PROPS)}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          <Btn tagName="span" className="FormField-spin FormField-spin--plus"
            disabled={disabled}
            onClick={(ev) => this.handleChange(ev, val + 1)}
          >
          </Btn>
          <Btn tagName="span" className="FormField-spin FormField-spin--minus"
            disabled={disabled}
            onClick={(ev) => this.handleChange(ev, val - 1)}
          >
          </Btn>
          {error &&
            <p className="FormField-error">{error}</p>
          }
        </div>
      </div>
    );
  }
}

FormFieldNumber.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  label: PropTypes.node,
  value: PropTypes.number,
  name: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  debounce: PropTypes.number,
  touched: PropTypes.bool,

  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  validation: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

FormFieldNumber.defaultProps = {
  className: '',
  value: 0,

  debounce: 200,
  size: 100,

  validation () {},
  onChange () {},
  onFocus () {},
  onBlur () {},
};

export default FormFieldNumber;
