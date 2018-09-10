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

const render = ({
  rehydrated,
  root
}: {
  rehydrated?: React.ReactNode;
  root?: Element;
}) => {
  if (!rehydrated || !root) {
    return;
  }

  // Unmount; it's possible that this was rehydrated previously.
  ReactDOM.unmountComponentAtNode(root);

  ReactDOM.render(rehydrated as React.ReactElement<any>, root);
};

export default async (container: Element) => {
  const roots = Array.from(
    // TODO: allow setting a container identifier so multiple rehydration instances can exist
    container.querySelectorAll("[data-react-from-markup-container]")
  );

  // TODO: solve race condition when a second rehydrate runs

  const renders = [];

  for (const root of roots) {
    // It's possible that this root was detached by a previous render in this loop
    if (container.contains(root)) {
      renders.push(async () => {
        try {
          const rehydrated = await domElementToReact(root, customHandler);

          return { root, rehydrated };
        } catch (e) {
          /* tslint:disable-next-line no-console */
          console.error("Rehydration failure", e);
        }

        return {};
      });
    }
  }

  await Promise.all(renders.map(r => r().then(render)));
};

export { IRehydrator, rehydratableToReactElement, registerRehydrator };
