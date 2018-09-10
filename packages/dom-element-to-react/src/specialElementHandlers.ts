// For information on defaultValue vs. value, defaultChecked vs. checked,
// and defaultValue vs. selected, see React's documentation on uncontrolled
// form elements: https://reactjs.org/docs/uncontrolled-components.html

import { IAttributeList } from "./IAttributeList";

interface ISpecialElementHandlers {
  [propName: string]: (
    el: Element,
    attributes: IAttributeList
  ) => IAttributeList;
}

const specialElementHandlers: ISpecialElementHandlers = {
  input: (el: Element, attributes: IAttributeList): IAttributeList => {
    const toReturn = { ...attributes };

    // Never pass value or checked. These props would switch React form
    // elements into controlled mode.
    if (typeof toReturn.checked !== "undefined") {
      delete toReturn.checked;
    }

    if (typeof toReturn.value !== "undefined") {
      delete toReturn.value;
    }

    // Use the DOM element properties instead of attributes. These may reflect
    // changes the user has already made before we could rehydrate.
    if ((el as HTMLInputElement).checked) {
      toReturn.defaultChecked = (el as HTMLInputElement).checked;
    }

    if ((el as HTMLInputElement).value) {
      toReturn.defaultValue = (el as HTMLInputElement).value;
    }

    return toReturn;
  },

  option: (_: Element, attributes: IAttributeList): IAttributeList => {
    const toReturn = { ...attributes };

    // <option> elements will have their "selected" attribute hoisted to the
    // <select> element that contains them, as a defaultValue.
    if (typeof toReturn.selected !== "undefined") {
      delete toReturn.selected;
    }

    return toReturn;
  },

  select: (el: Element, attributes: IAttributeList): IAttributeList => {
    const toReturn = { ...attributes };

    // Passing value would switch <select> into controlled mode.
    if (typeof toReturn.value !== "undefined") {
      delete toReturn.value;
    }

    // Use the DOM element properties instead of attributes. These may reflect
    // changes the user has already made before we could rehydrate.
    if ((el as HTMLSelectElement).value) {
      toReturn.defaultValue = (el as HTMLSelectElement).value;
    }

    return toReturn;
  },

  textarea: (el: Element, attributes: IAttributeList): IAttributeList => {
    const toReturn = { ...attributes };

    // Passing value would switch <textarea> into controlled mode.
    if (typeof toReturn.value !== "undefined") {
      delete toReturn.value;
    }

    // Use the DOM element properties instead of attributes. These may reflect
    // changes the user has already made before we could rehydrate.
    if ((el as HTMLTextAreaElement).value) {
      toReturn.defaultValue = (el as HTMLTextAreaElement).value;
    }

    return toReturn;
  }
};

export default specialElementHandlers;
