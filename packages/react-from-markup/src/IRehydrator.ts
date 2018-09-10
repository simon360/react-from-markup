import * as React from "react";

type RehydrateChildren = (el: Element) => Promise<React.ReactNode>;

export default interface IRehydrator {
  [name: string]: (
    el: Element,
    rehydrateChildren: RehydrateChildren,
    extra: object
  ) => Promise<React.ReactElement<any>>;
}
