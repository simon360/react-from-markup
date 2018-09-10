import React from "react";
import ShowMoreText from "./ShowMoreText";

export default async domNode => {
  const props = {
    content: domNode.getAttribute("data-content")
  };

  return <ShowMoreText {...props} />;
};
