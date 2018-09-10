import * as React from "react";
import staticToReactElement, {
  StaticToReactElementRecursor
} from "./staticToReactElement";

export type CustomElementHandlerType = (
  el: Element
) => Promise<React.ReactNode | false>;

const convertText = (el: Text): string =>
  // Text node - no need to convert, just return the text.
  el.data;

const convertElement = async (
  el: Element,
  customElementHandler: CustomElementHandlerType,
  recursor: StaticToReactElementRecursor
): Promise<React.ReactNode> =>
  // If customElementHandler is truthy, use it; otherwise, just convert to a React element.
  (await customElementHandler(el)) || staticToReactElement(el, recursor);

const convert = async (
  el: Node,
  customElementHandler: CustomElementHandlerType
): Promise<React.ReactNode | string | null> => {
  const recursor: StaticToReactElementRecursor = async (innerEl: Node) =>
    convert(innerEl, customElementHandler);

  if (el.nodeType === Node.TEXT_NODE) {
    return convertText(el as Text);
  } else if (el.nodeType === Node.ELEMENT_NODE) {
    return convertElement(el as Element, customElementHandler, recursor);
  }

  // Unhandled node type. Probably an HTML comment.
  // Discard it, because we can't represent it in React.
  return null;
};

export default convert;
