import * as React from "react";
import convert, { CustomElementHandlerType } from "./convert";

const rehydrateChildren = async (
  node: Node,
  customHandler: CustomElementHandlerType
): Promise<React.ReactNode> => {
  if (!node || !node.childNodes) {
    return null;
  } else if (node.childNodes.length === 1) {
    return convert(node.childNodes[0], customHandler);
  }

  const children = await Promise.all(
    Array.from(node.childNodes).map(child => convert(child, customHandler))
  );

  return React.createElement(React.Fragment, {}, ...children);
};

export default rehydrateChildren;
