import * as React from "react";

export default interface IRehydrator {
  name: string;
  elementToReact: (el: Element) => React.ReactNode;
}
