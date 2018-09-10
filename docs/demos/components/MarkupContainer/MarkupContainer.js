import React from "react";
import ReactDOMServer from "react-dom/server";

import PropTypes from "prop-types";
import rehydrate from "react-from-markup";

/**
 * A way to demonstrate react-from-markup inside docz.
 *
 * This isn't how you would use react-from-markup in production.
 */
class MarkupContainer extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    options: PropTypes.object,
    rehydrators: PropTypes.object,
    separateContainers: PropTypes.bool
  };

  static defaultProps = {
    separateContainers: true
  };

  mainRef = React.createRef();

  state = {
    markup: ""
  };

  static getDerivedStateFromProps(props) {
    if (props.separateContainers) {
      return {
        markup: React.Children.map(props.children, child =>
          ReactDOMServer.renderToStaticMarkup(child)
        )
      };
    }

    return {
      markup: [ReactDOMServer.renderToStaticMarkup(props.children)]
    };
  }

  rehydrate() {
    rehydrate(this.mainRef.current, this.props.rehydrators, this.props.options);
  }

  componentDidMount() {
    this.rehydrate();
  }

  componentDidUpdate() {
    this.rehydrate();
  }

  render() {
    const { markup } = this.state;

    return (
      <div ref={this.mainRef}>
        {markup.map((__html, i) => (
          <div
            data-react-from-markup-container
            dangerouslySetInnerHTML={{ __html }}
            key={i}
          />
        ))}
      </div>
    );
  }
}

export default MarkupContainer;
