(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{"./docs/rehydrators/using-extra.mdx":function(e,n,a){"use strict";a.r(n);var t=a("./node_modules/react/index.js"),o=a.n(t),r=a("./node_modules/@mdx-js/tag/dist/index.js");function m(e,n){if(null==e)return{};var a,t,o=function(e,n){if(null==e)return{};var a,t,o={},r=Object.keys(e);for(t=0;t<r.length;t++)a=r[t],n.indexOf(a)>=0||(o[a]=e[a]);return o}(e,n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(t=0;t<r.length;t++)a=r[t],n.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(o[a]=e[a])}return o}n.default=function(e){var n=e.components;m(e,["components"]);return o.a.createElement(r.MDXTag,{name:"wrapper",components:n},o.a.createElement(r.MDXTag,{name:"h1",components:n,props:{id:"using-the-extra-argument"}},"Using the ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:n,parentName:"h1"},"extra")," argument"),o.a.createElement(r.MDXTag,{name:"blockquote",components:n},o.a.createElement(r.MDXTag,{name:"p",components:n,parentName:"blockquote"},"A working version of this can be seen in the ",o.a.createElement(r.MDXTag,{name:"a",components:n,parentName:"p",props:{href:"/demo/HelloUser"}},o.a.createElement(r.MDXTag,{name:"inlineCode",components:n,parentName:"a"},"HelloUser")," demo"))),o.a.createElement(r.MDXTag,{name:"p",components:n},"If you have any page-level state that needs to be available to your components, you can use the ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:n,parentName:"p"},"extra")," argument - it's the third argument passed to every rehydrator."),o.a.createElement(r.MDXTag,{name:"p",components:n},"Let's say that you have a component called ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:n,parentName:"p"},"HelloUser"),", which simply outputs a heading that greets the current user."),o.a.createElement(r.MDXTag,{name:"p",components:n},"In order to avoid binding ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:n,parentName:"p"},"HelloUser")," to a particular method of storing the user name it accepts a ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:n,parentName:"p"},"userName")," prop:"),o.a.createElement(r.MDXTag,{name:"pre",components:n},o.a.createElement(r.MDXTag,{name:"code",components:n,parentName:"pre",props:{className:"language-jsx"}},'<HelloUser userName="John Smith" />\n')),o.a.createElement(r.MDXTag,{name:"p",components:n},"But, on your site, you know that ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:n,parentName:"p"},"userName")," is always available in a ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:n,parentName:"p"},"user_name")," cookie. When you rehydrate, you can pass this into the ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:n,parentName:"p"},"extra")," property of the ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:n,parentName:"p"},"options"),":"),o.a.createElement(r.MDXTag,{name:"pre",components:n},o.a.createElement(r.MDXTag,{name:"code",components:n,parentName:"pre",props:{className:"language-javascript"}},'import rehydrate from "react-from-markup";\nimport helloUserRehydrator from "./components/HelloUser/rehydrator";\n\nimport Cookies from "js-cookie";\n\nrehydrate(\n  document.getElementById("root"),\n  {\n    HelloUser: helloUserRehydrator\n  },\n  {\n    extra: {\n      userName: Cookies.get("user_name")\n    }\n  }\n)\n')),o.a.createElement(r.MDXTag,{name:"p",components:n},"Now, ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:n,parentName:"p"},"userName")," is available to your rehydrator:"),o.a.createElement(r.MDXTag,{name:"pre",components:n},o.a.createElement(r.MDXTag,{name:"code",components:n,parentName:"pre",props:{className:"language-javascript"}},'import HelloUser from "./HelloUser";\n\nexport default async (domNode, rehydrateChildren, { userName }) => {\n  return <HelloUser userName={userName} />;\n};\n')))}}}]);