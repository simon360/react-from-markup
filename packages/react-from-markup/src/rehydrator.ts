import domElementToReact from "dom-element-to-react";
import * as ReactDOM from "react-dom";

import IRehydrator from "./IRehydrator";

const registeredRehydrators: IRehydrator[] = [];

const registerRehydrator = (rehydrator: IRehydrator) => {
  const existingRehydrator = registeredRehydrators.findIndex(
    r => r.name === rehydrator.name
  );

  if (existingRehydrator >= 0) {
    /* tslint:disable-next-line no-console */
    console.warn(
      `A rehydrator with the name ${
        rehydrator.name
      } already exists. The previous version will be replaced.`
    );

    registeredRehydrators[existingRehydrator] = rehydrator;
  } else {
    registeredRehydrators.push(rehydrator);
  }
};

const rehydratableToReactElement = async (el: Element) => {
  const rehydratorName = el.getAttribute("data-rehydratable");
  const rehydrator = registeredRehydrators.find(r => r.name === rehydratorName);

  if (!rehydrator) {
    throw new Error(`No rehydrator found for type ${rehydratorName}`);
  }

  return rehydrator.elementToReact(el);
};

const customHandler = async (node: Node) => {
  // This function will run on _every_ node that domElementToReact encounters.
  // Make sure to keep the conditional highly performant.
  if (
    node.nodeType === Node.ELEMENT_NODE &&
    (node as Element).hasAttribute("data-rehydratable")
  ) {
    return rehydratableToReactElement(node as Element);
  }

  return false;
};

export default async (container: Element) => {
  const roots = Array.from(
    container.querySelectorAll("[data-react-from-markup-container]")
  );

  for (const root of roots) {
    // It's possible that this root was detached by a previous render in this loop
    if (container.contains(root)) {
      try {
        const rehydrated = await domElementToReact(root, customHandler);

        // Unmount; it's possible that this was rehydrated previously.
        ReactDOM.unmountComponentAtNode(root);

        ReactDOM.render(rehydrated as React.ReactElement<any>, root);
      } catch (e) {
        /* tslint:disable-next-line no-console */
        console.error("Rehydration failure", e);
      }
    }
  }
};

export { IRehydrator, rehydratableToReactElement, registerRehydrator };
