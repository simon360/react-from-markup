# React from Markup

> Declare your React components with static HTML

## Why?

Sometimes, your tech stack doesn’t speak JavaScript very well.

This can be a particular problem with some CMS, or legacy systems. React is a JavaScript library, and oftentimes, it’s difficult to create the bootstrapping JavaScript from your templating system.

`react-from-markup` is intended to make it possible to use React components on these legacy systems, _without changing the way you write your React components_. It provides tools to simplify the mapping from `data-` attributes into React props, and _can even handle React children_.

The result: React can be used to build a component library, useable by other React apps, but you don’t need to write a second component library for your legacy systems, or a second set of non-React JavaScript. You just need to integrate new markup into your non-React templates, and run a script on page load to initialize.

## Notable uses

- Thomson Reuters uses `react-from-markup` on its Enterprise Web Platform. It runs on Adobe Experience Manager and HTL, and powers thomsonreuters.com, business unit sites, and campaign pages. It’s also used on their blog network, a WordPress-based platform of blogs. The same React-based component library is able to back each platform, and is also used in several non-`react-from-markup` sites that were able to use React directly, such as the [2017 Annual Report](https://annual-report.thomsonreuters.com).

## Documentation

In-depth documentation can be found [here](https://simon360.github.io/react-from-markup).
