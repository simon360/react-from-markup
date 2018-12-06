/* eslint-env jest */
import * as React from "react";
import reactFromMarkupContainer from "..";

describe("reactFromMarkupContainer E2E tests", async () => {
  it("Should rehydrate a basic component", async () => {
    const COMPONENT_NAME: string = "myComponent";
    let myComponentRef: HTMLElement | null = null;

    const rehydrator = async () => {
      return React.createElement(
        "span",
        {
          ref: ref => {
            myComponentRef = ref;
          },
          testid: COMPONENT_NAME
        },
        "rehydrated component"
      );
    };

    const rehydrators = { [COMPONENT_NAME]: rehydrator };
    const documentElement = document.createElement("div");

    documentElement.innerHTML = `
      <div data-react-from-markup-container>
        <div data-rehydratable="${COMPONENT_NAME}"></div>
      </div>`;

    await reactFromMarkupContainer(documentElement, rehydrators, {
      extra: {}
    });

    expect(documentElement.querySelector(`[testid=${COMPONENT_NAME}]`)).toBe(
      myComponentRef
    );
    expect(documentElement.innerHTML).toMatchSnapshot();
  });

  it("Should rehydrate valid HTML markup", async () => {
    const documentElement = document.createElement("div");

    documentElement.innerHTML = `
    <div data-react-from-markup-container>
      <p style="">paragraph</p>
      <p ref="">paragraph</p>
      <p key="">paragraph</p>
      <p children="">paragraph</p>
      <p dangerouslySetInnerHTML="{__html:'should not be children'}"></p>
    </div>`;

    await reactFromMarkupContainer(documentElement, {}, { extra: {} });

    expect(documentElement.innerHTML).toMatchSnapshot();
  });
});
