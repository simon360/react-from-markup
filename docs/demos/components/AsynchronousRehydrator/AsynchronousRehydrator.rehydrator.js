import React from "react";
import AsynchronousRehydrator from "./AsynchronousRehydrator";

const delayBy = delay => {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
};

export default async domNode => {
  const delay = domNode.getAttribute("data-delay");

  await delayBy(parseInt(delay));

  return <AsynchronousRehydrator isRehydrating={true} />;
};
