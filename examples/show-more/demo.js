import React, { Component } from "react";
import { HelloUser, helloUserRehydrator } from "../hello-user/demo";

class ShowMore extends Component {
  state = {
    open: false
  };

  toggleOpen = () => {
    this.setState(({ open }) => ({ open: !open }));
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

const showMoreRehydrator = async (domNode, rehydrateChildren) => {
  const children = await rehydrateChildren(
    domNode.querySelector(".ShowMore-children")
  );

  return <ShowMore>{children}</ShowMore>;
};

export const markup = `
  <div data-react-from-markup-container>
    <div class="ShowMore" data-rehydratable="ShowMore">
      <button>Show more</button>
      <div class="ShowMore-children" style="display:none">
        <p>I can contain <b>complex</b> <em>DOM structures</em>.</p>
        <h2 data-rehydratable="HelloUser">Hello, !</h2>
      </div>
    </div>
  </div>
`;

export { HelloUser, helloUserRehydrator, ShowMore, showMoreRehydrator };
