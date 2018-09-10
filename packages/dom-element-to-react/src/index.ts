import * as React from "react";
import convert, { CustomElementHandlerType } from "./convert";

const rehydrateChildren = (
  node: Node,
  customHandler: CustomElementHandlerType
): React.ReactNode => {
  if (!node || !node.childNodes) {
    return null;
  } else if (node.childNodes.length === 1) {
    return convert(node.childNodes[0], customHandler);
  }

  return React.createElement(
    React.Fragment,
    {},
    ...Array.from(node.childNodes).map(child => convert(child, customHandler))
  );
};

export default rehydrateChildren;
