# react-from-markup

> Declare your React props with `data-` attributes

## Intro

`react-from-markup` converts this

```html
<div
  data-rehydratable="ShowMore"
  data-content="Hello, World!"
>
  Hello, World!
</div>
```

into this

```jsx
<ShowMore content="Hello, World!" />
```

using a _rehydrator_:

```jsx
import ShowMore from "./ShowMore";

export default async domNode => {
  return <ShowMore content={domNode.getAttribute("data-content")} />;
};
```

This is extremely useful for changing React props in a non-React environment, like a CMS with its own templating language.

## Features

- Convert static markup into React components
- Rehydrate React children
- Asynchronous rehydration
- Much more

## Quick start

Install `react-from-markup`

```sh
npm install react-from-markup --save
```

Annotate your component’s markup with `data-` attributes for each prop, and a `data-rehydratable` attribute to let `react-from-markup` identify your component.

```jsx
// components/ShowMore/index.jsx
export default ({ content }) => {
  <div data-content={content} data-rehydratable="ShowMore">
    {content}
  </div>;
};
```

Write a rehydrator for your component, to describe how to map static data back to React props:

```jsx
// components/ShowMore/rehydrator.jsx
import ShowMore from "./ShowMore";

export default async domNode => {
  return <ShowMore content={domNode.getAttribute("data-content")} />;
};
```

Add your component to your page, wrapping it in a _markup-container_. `react-from-markup` will only rehydrate markup inside this.

```html
<!-- index.html -->
<html>
  <body>
    <div id="root">
      <div data-react-from-markup-container>
        <div data-rehydratable="ShowMore" data-content="Hello, World">
          Hello, World
        </div>
      </div>
    </div>
  </body>
</html>
```

> Note, this markup could have been produced by React, using the `<ShowMore />` component.

Run `react-from-markup` on page load.

```js
// index.js
import rehydrate from "react-from-markup";
import showMoreRehydrator from "./components/ShowMore/rehydrator";

rehydrate(document.getElementById("root"), {
  ShowMore: showMoreRehydrator
});
```

## Full Documentation

In-depth documentation can be found [here](https://simon360.github.io/react-from-markup).

## Notable uses

- [Thomson Reuters](thomsonreuters.com) uses `react-from-markup` on its Enterprise Web Platform. It runs on Adobe Experience Manager and HTL, and powers thomsonreuters.com, business unit sites, and campaign pages. It’s also used on their blog network, a WordPress-based platform of blogs. The same React-based component library is able to back each platform, and is also used in several non-`react-from-markup` sites that were able to use React directly, such as the [2017 Annual Report](https://ar.tr.com).
