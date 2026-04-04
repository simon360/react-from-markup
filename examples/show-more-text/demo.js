import React, { Component } from "react";

class ShowMoreText extends Component {
  state = {
    open: false
  };

  toggleOpen = () => {
    this.setState(({ open }) => ({ open: !open }));
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

const showMoreTextRehydrator = async domNode => {
  return <ShowMoreText content={domNode.getAttribute("data-content")} />;
};

export const markup = `
  <div data-react-from-markup-container>
    <div
      class="ShowMoreText"
      data-rehydratable="ShowMoreText"
      data-content="Hello, world!"
    >
      <button>Show more</button>
      <p class="ShowMoreText-content" style="display:none">Hello, world!</p>
    </div>
  </div>
`;

export { ShowMoreText, showMoreTextRehydrator };
