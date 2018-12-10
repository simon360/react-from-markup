import domElementToReact from "dom-element-to-react";
import * as React from "react";
import rehydrate, {
  IOptions,
  rehydratableToReactElement
} from "../src/rehydrator";

jest.mock("dom-element-to-react", () => ({
  default: jest.fn(() => {
    // `require`d to compensate for Jest mock hoisting
    const ReactInMock = require("react");

    return ReactInMock.createElement("div", { "data-is-rehydrated": true });
  })
}));

describe("rehydratableToReactElement", () => {
  const rehydratorName = "MyRehydratable";
  const rehydratorFakeReturnValue = React.createElement("span", {
    "data-is-rehydrated": true
  });
  const rehydrators = {
    [rehydratorName]: jest.fn(() => Promise.resolve(rehydratorFakeReturnValue))
  };

  const options: IOptions = {
    extra: {
      attr1: "yes",
      attr2: "sure"
    }
  };

  it("should call a rehydrator with correct arguments", async () => {
    const element = document.createElement("div");

    element.setAttribute("data-rehydratable", rehydratorName);

    const result = await rehydratableToReactElement(
      element,
      rehydrators,
      options
    );

    expect(rehydrators[rehydratorName]).toHaveBeenLastCalledWith(
      element,
      expect.anything(),
      options.extra
    );

    expect(result).toBe(rehydratorFakeReturnValue);
  });

  it("should fail if rehydrator does not exist", () => {
    const element = document.createElement("div");

    element.setAttribute("data-rehydratable", rehydratorName);

    expect(
      rehydratableToReactElement(element, {}, options)
    ).rejects.toMatchSnapshot();
  });

  it("should fail if element is not a rehydratable", async () => {
    const element = document.createElement("div");

    expect(
      rehydratableToReactElement(element, rehydrators, options)
    ).rejects.toMatchSnapshot();
  });
});

describe("rehydrate()", () => {
  const createMarkupContainer = () => {
    const container = document.createElement("div");

    container.setAttribute("data-react-from-markup-container", "true");

    return container;
  };

  it("should find a markup container and rehydrate it", async () => {
    const root = document.createElement("div");
    const markupContainer = createMarkupContainer();

    root.appendChild(markupContainer);

    await rehydrate(root, {}, { extra: {} });

    expect(domElementToReact).toHaveBeenCalledWith(
      markupContainer,
      expect.anything()
    );

    expect(root.querySelectorAll("[data-is-rehydrated=true]").length).toBe(1);
  });

  it("should rehydrate other containers if one container fails", async () => {});
});
