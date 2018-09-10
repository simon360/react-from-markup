# React from Markup

> Declare your React components with static HTML

## Why?

Sometimes, your tech stack doesn’t speak JavaScript very well.

This can be a particular problem with some CMS, or legacy systems. React is a JavaScript library, and oftentimes, it’s difficult to create the bootstrapping JavaScript from your templating system.

`react-from-markup` is intended to make it possible to use React components on these legacy systems, _without changing the way you write your React components_. It provides tools to simplify the mapping from `data-` attributes into React props, and _can even handle React children_.

The result: React can be used to build a component library, useable by other React apps, but you don’t need to write a second component library for your legacy systems, or a second set of non-React JavaScript. You just need to integrate new markup into your non-React templates, and run a script on page load to initialize.

## How?

`react-from-markup` provides a framework to simplify the development of interactive components which need to be rehydrated. It considers a few cases:

- _Static components_: simple markup, ;like text or links, that don’t need to be rehydrated
- _Stateful components_: more complex components, which maintain some internal state that can change while a user is on the page, such as responding to events or using React’s context API.
- _Stateful, composeable components_: Stateful components that contain children, or any props that accept React elements, which may themselves be static, stateful, or composeable

### Static components

In most cases, a static component will be a simple React component that does not use `this.state` or use event listeners.

For example, consider a simple Heading component, which is used like so:

```javascript
<Heading rank=“3” kind=“xl”>Hello, world!</Heading>
```

This component may create the following markup:

```html
<h3 class=“Heading Heading--xl”>Hello, world!</h3>
```

As long as the CSS for `.Heading` and `.Heading--xl` are available, you could simply integrate this markup into your templates, and it would work as expected. You may do something like:

```
<h{{ rank }} class=“Heading Heading--{{ kind }}”>{{ headingText }}</h{{ rank }}>
```

### Stateful components

`react-from-markup` only becomes useful when your components start having state.

For example, say you had a simple banner component that can be dismissed when an “OK” button is clicked. Its JSX may look like this:

```javascript
<Banner text=“Our site uses cookies” />
```

Its HTML may look like this:

```html
<div class=“Banner”>
  <p>Our site uses cookies</p>
  <button>OK</button>
</div>
```

You could integrate this markup into your legacy system, and it would probably _look_ fine - but the button won’t do anything. That’s because this React component is interactive. In the actual component implementation, there is probably an `onClick` listener on the `<button />` that looks like this:

```javascript
<button onClick={() => this.setState({ closed: true })}>OK</button>
```

When we take the static markup and integrate it, this `onClick` listener is lost. Enter `react-from-markup`.

To turn this static markup back into a React element, which has the `onClick` handler, you would write a _rehydrator_. Your whole component may look something like this:

```javascript
import React, { Component } from “react”;
import PropTypes from “prop-types”;

export default class extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired
  };

  state = {
    closed: false
  };

  render() {
    const { text } = this.props;

    return <div className=“Banner” data-rehydratable=“Banner”>
      <p>{text}</p>
      <button onClick={() => this.setState({ closed: true })}>OK</button>
    </div>;
  }
};

export const rehydrator = {
  name: “Banner”,

  elementToReact: domNode => {
    const text = domNode.querySelector(“p”).innerText;

    return <Banner text={text} />;
  }
}
```

When this rehydrator is _registered_ with `react-from-markup`, the static version will be replaced when the page loads, but maintain whatever text was originally included inside the `<p>` element when the page first loaded.

### Stateful, composeable components

The previous example illustrated how you can handle primitive prop types with `react-from-markup`. However, sometimes you’re not just dealing with text. What if the text contained `<strong>` elements? Or what if you had an interactive component that contained another interactive component, but both components have properties that can be authored?

That’s where `rehydrateChildren()` comes in. Given one or more DOM nodes, `rehydrateChildren()` will return the equivalent React element. If it encounters any rehydratable elements, it will run their dehydrators. It is, essentially, a way to recurse over the DOM and generate an equivalent React tree.

Let’s say you had two components:

- `<Expandable />`, a component that hides its children until a “Show More” button is clicked
- `<VideoPlayer />`, a component that loads a video at `videoId` from YouTube when a button is clicked.

`<Expandable />` could contain a `<VideoPlayer />`, or any other arbitrary markup. It doesn’t care what its children are; it will just hide them and show them when a button is clicked. `<VideoPlayer />` is a leaf component; it will either show a play button or a YouTube embed. It doesn’t have any children, but it does need to rehydrate its `videoId` prop.

The rehydration for `<VideoPlayer />` is simple:

```javascript
export const rehydrator = {
  name: “VideoPlayer”,

  elementToReact: domNode => {
    const videoId = domNode.dataset.videoId;

    return <VideoPlayer videoId={videoId} />;
  }
};
```

The rehydration for `<Expandable />` , however, uses `rehydrateChildren`:

```javascript
import { rehydrateChildren } from “react-from-markup”;

export const rehydrator = {
  name: “Expandable”,

  elementToReact: domNode => {
    const children = rehydrateChildren(domNode.querySelector(“.Expandable-inner”));
    const text = domNode.querySelector(“button”).innerText;

    return <Expandable text={text}>{children}</Expandable>;
  }
};
```

Using both of these rehydrators would turn this markup:

```html
<div className=“Expandable” data-rehydratable=“Expandable”>
  <button>Show more</button>

  <div className=“Expandable-inner is-hidden”>
    <p>This is a great video.</p>

    <div data-rehydratable=“VideoPlayer” data-video-id=“a6egh34f”>
      <button>Play video</button>
    </div>

    <p>Thanks for expanding.</p>
  </div>
</div>
```

into this:

```javascript
<Expandable text=“Show more”>
  <p>This is a great video.</p>

  <VideoPlayer videoId=“a6egh34f” />

  <p>Thanks for expanding.</p>
</Expandable>
```

Because `rehydrateChildren` is recursive, it allows you to create deep structures of rehydrated components, with relatively little bootstrapping code.

## Notable uses

- Thomson Reuters uses `react-from-markup` on its Enterprise Web Platform. It runs on Adobe Experience Manager and HTL, and powers thomsonreuters.com, business unit sites, and campaign pages. It’s also used on their blog network, a WordPress-based platform of blogs. The same React-based component library is able to back each platform, and is also used in several non-`react-from-markup` sites that were able to use React directly, such as the [2017 Annual Report](https://ar.tr.com).

## Rehydration regions

For a component to rehydrate with `react-from-markup`, it needs to have a _rehydration region_ as an ancestor.

A rehydration region is a simple `div` element that has a `data-react-from-markup` attribute. Every descendent of this `div` will be converted to a React element - whether it’s a rehydratable or not. A `p` DOM element will be converted to a `p` React element, and all of its attributes and children will be preserved.

In more concrete terms, the following markup:

```html
<div data-react-from-markup>
  <p>Hello, <strong>world!</strong></p>

  <div class=“Banner”>
    <p>Our site uses cookies</p>
    <button>OK</button>
  </div>
</div>
```

would, ultimately, result in the following JavaScript being run, where `domNode` is the actual DOM node with `data-react-from-markup` set on it:

```javascript
ReactDOM.render(
  <React.Fragment>
    <p>Hello, <strong>world!</strong></p>

    <Banner text=“Our site uses cookies” />
  </React.Fragment>,
  domNode
);
```

Rehydration regions are crucial: without them, `ReactDOM.render` wouldn’t have a target node to render into.

## Caveats

### CSS and Stylesheets

Your CSS and class names should be reasonably stable from release to release. Frameworks like `styled-ccomponents` generate hashes for their class names, which can result in a lot of markup changes. Every markup change will need to be implemented in your legacy systems’ templates. Using BEM or SUITCSS in your class naming, and maintaining normal CSS files rather than CSS-in-JS, will likely be easier to maintain.

### Communication between rehydrated components

Use Context

### Forms

Complicated - see code
