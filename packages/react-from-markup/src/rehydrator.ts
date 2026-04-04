import domElementToReact from "@sivaraj-v/dom-element-to-react";
import * as ReactDOM from "react-dom";
import { createRoot, IRoot } from "react-dom/client";

type IOptions = import("./IOptions").default;
type IRehydrator = import("./IRehydrator").default;

const reactRoots = new WeakMap<Element, IRoot>();

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

  const reactRoot = reactRoots.get(root) || createRoot(root);
  reactRoots.set(root, reactRoot);

  const flushSync = (ReactDOM as any).flushSync;

  if (flushSync) {
    flushSync(() => reactRoot.render(rehydrated));
    return;
  }

  reactRoot.render(rehydrated);
};

export default async (
  container: Element,
  rehydrators: IRehydrator,
  options: IOptions
) => {
  const roots = Array.from(
    // TODO: allow setting a container identifier so multiple rehydration instances can exist
    container.querySelectorAll("[data-react-from-markup-container]")
  ).reduce((acc: Element[], root: Element) => {
    // filter roots that are contained within other roots
    if (!acc.some(r => r.contains(root))) {
      acc.push(root);
    }
    return acc;
  }, []);

  // TODO: solve race condition when a second rehydrate runs

  const renders = [];

  for (const root of roots) {
    // It's possible that this root was detached by a previous render in this loop
    if (container.contains(root)) {
      renders.push(async () => {
        try {
          const rehydrated = await rehydrateChildren(
            root,
            rehydrators,
            options
          );

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

export { IRehydrator, rehydratableToReactElement, rehydrateChildren };
