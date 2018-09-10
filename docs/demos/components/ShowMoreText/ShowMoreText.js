import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ShowMore extends Component {
  static propTypes = {
    content: PropTypes.string.isRequired
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
    const { content } = this.props;
    const { open } = this.state;

    return (
      <div
        className="ShowMoreText"
        data-rehydratable="ShowMoreText"
        data-content={content}
      >
        <button onClick={this.toggleOpen}>Show more</button>
        <p
          className="ShowMoreText-content"
          style={{ display: open ? "block" : "none" }}
        >
          {content}
        </p>
      </div>
    );
  }
}
