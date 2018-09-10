import React from "react";
import ShowMore from "./ShowMore";

export default async (domNode, rehydrateChildren) => {
  const children = await rehydrateChildren(
    domNode.querySelector(".ShowMore-children")
  );

  return <ShowMore>{children}</ShowMore>;
};
