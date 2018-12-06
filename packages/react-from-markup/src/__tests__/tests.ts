/* eslint-env jest */
import * as React from "react";
import reactFromMarkupContainer from "..";

describe("reactFromMarkupContainer E2E tests", async () => {
  it("Should rehydrate a basic component", async () => {
    const componentName: string = "myComponent";

    const rehydrator = async () => {
      return React.createElement("span", {}, "rehydrated component");
    };

    const rehydrators = { [componentName]: rehydrator };
    const documentElement = document.createElement("div");

    documentElement.innerHTML = `
      <div data-react-from-markup-container>
        <div data-rehydratable="${componentName}"></div>
      </div>`;

    await reactFromMarkupContainer(documentElement, rehydrators, {
      extra: {}
    });

    expect(documentElement.innerHTML).toMatchSnapshot();
  });

  it("Should rehydrate valid HTML markup", async () => {
    const documentElement = document.createElement("div");

    documentElement.innerHTML = `
    <div data-react-from-markup-container>
      <p>paragraph</p>
    </div>`;

    await reactFromMarkupContainer(documentElement, {}, { extra: {} });

    expect(documentElement.innerHTML).toMatchSnapshot();
  });
});
