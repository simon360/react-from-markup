import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ShowMore extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  state = {
    open: false
  };

  toggleOpen = () => {
    this.setState({
      open: !this.state.open
    });
  };

  render() {
    const { children } = this.props;
    const { open } = this.state;

    return (
      <div className="ShowMore" data-rehydratable="ShowMore">
        <button onClick={this.toggleOpen}>Show more</button>
        <div
          className="ShowMore-children"
          style={{ display: open ? "block" : "none" }}
        >
          {children}
        </div>
      </div>
    );
  }
}
