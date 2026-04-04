declare module "react-dom/client" {
  import * as React from "react";

  export interface IRoot {
    render(children: React.ReactNode): void;
    unmount(): void;
  }

  export function createRoot(container: Element): IRoot;
}
