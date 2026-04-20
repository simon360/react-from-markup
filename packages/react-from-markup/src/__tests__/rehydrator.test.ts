// We're testing some console functionality
/* tslint:disable no-console */

import rehydrate from "../rehydrator";

import * as MockReactDOM from "react-dom";
import mockRehydrateChildren from "../rehydrateChildren";

jest.mock("react-dom");
jest.mock("../rehydrateChildren");

const defaultRehydrators = {};
const defaultOptions = {
  extra: {}
};

describe("rehydrate", () => {
  // tslint:disable-next-line no-console
  const originalConsoleError = console.error;

  beforeEach(() => {
    (mockRehydrateChildren as any).mockClear();
    (mockRehydrateChildren as any).mockImplementation(() =>
      Promise.resolve({})
    );

    (MockReactDOM.render as any).mockClear();
    (MockReactDOM.unmountComponentAtNode as any).mockClear();

    // tslint:disable-next-line no-console
    console.error = jest.fn();
  });

  afterEach(() => {
    // tslint:disable-next-line no-console
    console.error = originalConsoleError;
  });

  it("should find markup containers", async () => {
    const el = document.createElement("div");

    el.innerHTML = `
    <div data-react-from-markup-container></div>
    <div></div>
    <p></p>
    <span data-react-from-markup-container></span>
    <strong></strong>
    `;

    const containers = Array.from(
      el.querySelectorAll("[data-react-from-markup-container]")
    );

    await rehydrate(el, defaultRehydrators, defaultOptions);

    expect(mockRehydrateChildren).toHaveBeenCalledTimes(2);

    for (const container of containers) {
      expect(mockRehydrateChildren).toHaveBeenCalledWith(
        container,
        {},
        {
          extra: {}
        }
      );
    }
  });

  it("should not rehydrate inside nested containers", async () => {
    const el = document.createElement("div");

    el.innerHTML = `
      <div data-react-from-markup-container>
        <div data-react-from-markup-container></div>
      </div>
    `;

    const containers = Array.from(
      el.querySelectorAll(
        "[data-react-from-markup-container] [data-react-from-markup-container]"
      )
    );

    await rehydrate(el, defaultRehydrators, defaultOptions);

    expect(mockRehydrateChildren).toHaveBeenCalledTimes(1);

    for (const container of containers) {
      expect(mockRehydrateChildren).not.toHaveBeenCalledWith(
        container,
        {},
        {
          extra: {}
        }
      );
    }
  });

  it("should handle an exception in rehydrateChildren", async () => {
    (mockRehydrateChildren as any).mockImplementation(() =>
      Promise.reject("test rejection")
    );

    const el = document.createElement("div");

    el.innerHTML = `
      <div data-react-from-markup-container>
        hello world
      </div>
    `;

    await rehydrate(el, defaultRehydrators, defaultOptions);

    expect(console.error).toHaveBeenCalledTimes(1);
    expect((console.error as any).mock.calls[0]).toMatchSnapshot();
  });

  it("should resolve only when all containers have rehydrated", async () => {
    const resolves: Array<() => void> = [];

    (mockRehydrateChildren as any).mockImplementation(
      () => new Promise(resolve => resolves.push(resolve))
    );

    const el = document.createElement("div");

    el.innerHTML = `
      <div data-react-from-markup-container>
        hello world
      </div>
      <div data-react-from-markup-container>
        hello world 2
      </div>
    `;

    let resolved = false;

    const promise = rehydrate(el, defaultRehydrators, defaultOptions).then(
      () => (resolved = true)
    );

    expect(resolved).toBe(false);

    for (const resolve of resolves) {
      resolve();

      if (resolves.indexOf(resolve) === resolves.length - 1) {
        await promise;
        expect(resolved).toBe(true);
      } else {
        expect(resolved).toBe(false);
      }
    }
  });

  it("should always attempt to unmount before rendering", async () => {
    const el = document.createElement("div");

    el.innerHTML = `
      <div data-react-from-markup-container>
        hello world
      </div>
      <div data-react-from-markup-container>
        hello world 2
      </div>
    `;

    const containers = Array.from(
      el.querySelectorAll("[data-react-from-markup-container]")
    );

    await rehydrate(el, defaultRehydrators, defaultOptions);

    expect(MockReactDOM.unmountComponentAtNode).toHaveBeenCalledTimes(2);

    for (const container of containers) {
      expect(MockReactDOM.unmountComponentAtNode).toHaveBeenCalledWith(
        container
      );
    }
  });
});
