import { asynchronousRehydrator } from "./asynchronous/demo";
import { helloUserRehydrator } from "./hello-user/demo";
import { showMoreRehydrator } from "./show-more/demo";
import { showMoreTextRehydrator } from "./show-more-text/demo";

const allRehydrators = {
  AsynchronousRehydrator: asynchronousRehydrator,
  HelloUser: helloUserRehydrator,
  ShowMore: showMoreRehydrator,
  ShowMoreText: showMoreTextRehydrator
};

const exampleRegistry = {
  asynchronous: {
    options: { extra: {} },
    rehydratorNames: ["AsynchronousRehydrator"]
  },
  "hello-user": {
    options: { extra: { userName: "John Smith" } },
    rehydratorNames: ["HelloUser"]
  },
  "show-more": {
    options: { extra: { userName: "John Smith" } },
    rehydratorNames: ["HelloUser", "ShowMore"]
  },
  "show-more-text": {
    options: { extra: {} },
    rehydratorNames: ["ShowMoreText"]
  },
  static: {
    options: { extra: {} },
    rehydratorNames: []
  }
};

const getRehydrators = rehydratorNames =>
  rehydratorNames.reduce((acc, name) => {
    acc[name] = allRehydrators[name];
    return acc;
  }, {});

export { allRehydrators, exampleRegistry, getRehydrators };
