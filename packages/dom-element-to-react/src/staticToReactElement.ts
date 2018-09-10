import * as React from "react";

import { boolean, nameMap } from "./attributes";
import { IAttributeList } from "./IAttributeList";
import specialElementHandlers from "./specialElementHandlers";

export type StaticToReactElementRecursor = (
  el: Node
) => Promise<React.ReactNode>;

const mapAttributeToReact = (attributeName: string) => {
  return nameMap[attributeName.toLowerCase()] || attributeName.toLowerCase();
};

const makeRefStyleHandler = (styleString: string) => {
  return (ref: Element) => {
    if (ref !== null) {
      ref.setAttribute("style", styleString);
    }
  };
};

const bootstrapStyles = (attributes: IAttributeList): IAttributeList => ({
  ...attributes,

  ref: makeRefStyleHandler(attributes.style as string),
  style: undefined
});

export default async (el: Element, recursor: StaticToReactElementRecursor) => {
  const tagName = el.tagName.toLowerCase();
  let attributes: IAttributeList = {};

  if (el.hasAttributes()) {
    attributes = Array.from(el.attributes)
      .map(({ name, value }) => {
        if (boolean.includes(name) && value === "") {
          // React, and JavaScript, view "" as falsy. However, an empty string on
          // a DOM element's attribute makes it truthy. This compensates for the
          // discrepancy.
          return { name, value: true };
        }

        return { name, value };
      })
      .reduce(
        (acc, { name, value }): IAttributeList => ({
          ...acc,
          [mapAttributeToReact(name)]: value
        }),
        {}
      );

    if (attributes.style) {
      attributes = bootstrapStyles(attributes);
    }

    const handler = specialElementHandlers[tagName];

    if (handler) {
      attributes = handler(el, attributes);
    }
  }

  // <textarea>'s children will be replaced with the content of its value
  // property, so we should skip parsing them.
  if (tagName !== "textarea" && el.childNodes) {
    const children = await Promise.all(Array.from(el.childNodes).map(recursor));

    return React.createElement(tagName, attributes, ...children);
  }

  return React.createElement(tagName, attributes);
};
