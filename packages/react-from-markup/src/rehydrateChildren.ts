import domElementToReact from "dom-element-to-react";

import IOptions from "./IOptions";
import IRehydrator from "./IRehydrator";

const rehydratableToReactElement = async (
  el: Element,
  rehydrators: IRehydrator,
  options: IOptions
): Promise<React.ReactElement<any>> => {
  const rehydratorName = el.getAttribute("data-rehydratable");

  if (!rehydratorName) {
    throw new Error("Rehydrator name is missing from element.");
  }

  const rehydrator = rehydrators[rehydratorName];

  if (!rehydrator) {
    throw new Error(`No rehydrator found for type ${rehydratorName}`);
  }

  return rehydrator(
    el,
    children => rehydrateChildren(children, rehydrators, options),
    options.extra
  );
};

const createCustomHandler = (
  rehydrators: IRehydrator,
  options: IOptions
) => async (node: Node) => {
  // This function will run on _every_ node that domElementToReact encounters.
  // Make sure to keep the conditional highly performant.
  if (
    node.nodeType === Node.ELEMENT_NODE &&
    (node as Element).hasAttribute("data-rehydratable")
  ) {
    return rehydratableToReactElement(node as Element, rehydrators, options);
  }

  return false;
};

const rehydrateChildren = (
  el: Node,
  rehydrators: IRehydrator,
  options: IOptions
) => domElementToReact(el, createCustomHandler(rehydrators, options));

export default rehydrateChildren;
