import React, { Component } from 'react';

import Icon from '../Icon';

class Collapsible extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
      isAnimating: false,
    };
  }

  componentDidMount() {
    if (this.props.expanded) {
      this.handleToggle(null, true);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.expanded !== this.props.expanded) {
      this.handleToggle(null, nextProps.expanded);
    }
  }

  handleToggle(ev, forceToggle) {
    let { isExpanded } = this.state;
    let willExpand = typeof forceToggle === 'boolean' ? forceToggle : !isExpanded;
    this.setState({ isExpanded: willExpand, isAnimating: true });

    if (willExpand) {
      this.props.onExpand();
    } else {
      this.props.onCollapse();
    }

    setTimeout(() => { // allow CSS in/out animation
      if (this.refs.collapsible) { // check if still mounted
        this.setState({ isAnimating: false });
      }
    }, 700);
  }

  render() {
    let { className, children, header, disabled } = this.props;
    let { isExpanded, isAnimating } = this.state;
    className += isExpanded ? ' isExpanded' : ' isCollapsed';
    className += isAnimating ? ' isAnimating' : '';
    className += disabled ? ' isDisabled' : '';

    return (
      <div className={'Collapsible ' + className} ref="collapsible">
        <header className="Collapsible-header">
          {header}
          <button className="Collapsible-btn"
            type="button" disabled={disabled}
            onClick={this.handleToggle.bind(this)}
          >
            <Icon glyph="chevron-down" />
          </button>
        </header>

        {(isExpanded || isAnimating) &&
          <div className="Collapsible-content">
            {children}
          </div>
        }
      </div>
    );
  }
}

Collapsible.defaultProps = {
  className: '',
  header: '',
  disabled: false,
  expanded: false,

  onCollapse() {},
  onExpand() {},
};

export default Collapsible;