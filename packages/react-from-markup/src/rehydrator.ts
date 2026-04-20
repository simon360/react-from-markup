import * as ReactDOM from "react-dom";

import IOptions from "./IOptions";
import IRehydrator from "./IRehydrator";
import rehydrateChildren from "./rehydrateChildren";

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
