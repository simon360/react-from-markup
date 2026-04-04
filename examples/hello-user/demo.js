import React from "react";

const HelloUser = ({ userName }) => (
  <h2 data-rehydratable="HelloUser">Hello, {userName}!</h2>
);

const helloUserRehydrator = async (domNode, rehydrateChildren, { userName }) => {
  return <HelloUser userName={userName} />;
};

export const markup = `
  <div data-react-from-markup-container>
    <p>This will greet the user, whose name is passed through options.extra.</p>
    <h2 data-rehydratable="HelloUser">Hello, !</h2>
  </div>
`;

export { HelloUser, helloUserRehydrator };
