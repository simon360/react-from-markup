import React from "react";

const AsynchronousRehydrator = ({ delay, isRehydrating }) => (
  <div data-rehydratable="AsynchronousRehydrator" data-delay={delay}>
    {isRehydrating ? "I have rehydrated" : `I will rehydrate in ${delay}ms`}
  </div>
);

export default AsynchronousRehydrator;
