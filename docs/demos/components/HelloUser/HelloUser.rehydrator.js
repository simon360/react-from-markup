import React from "react";
import HelloUser from "./HelloUser";

export default async (domNode, rehydrateChildren, { userName }) => {
  return <HelloUser userName={userName} />;
};
