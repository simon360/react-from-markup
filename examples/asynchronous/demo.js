import React from "react";

const AsynchronousRehydrator = ({ delay, isRehydrating }) => (
  <div data-rehydratable="AsynchronousRehydrator" data-delay={delay}>
    {isRehydrating ? "I have rehydrated" : `I will rehydrate in ${delay}ms`}
  </div>
);

const delayBy = delay => {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
};

const asynchronousRehydrator = async domNode => {
  const delay = parseInt(domNode.getAttribute("data-delay"), 10);

  await delayBy(delay);

  return <AsynchronousRehydrator delay={delay} isRehydrating={true} />;
};

export const markup = `
  <div data-react-from-markup-container>
    <div data-rehydratable="AsynchronousRehydrator" data-delay="5000">I will rehydrate in 5000ms</div>
  </div>
  <div data-react-from-markup-container>
    <div data-rehydratable="AsynchronousRehydrator" data-delay="100">I will rehydrate in 100ms</div>
  </div>
  <div data-react-from-markup-container>
    <div data-rehydratable="AsynchronousRehydrator" data-delay="2500">I will rehydrate in 2500ms</div>
  </div>
`;

export { AsynchronousRehydrator, asynchronousRehydrator };
