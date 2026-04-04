# Examples

This folder is a small Vite multi-page app for the documented demos.

Commands:

- `yarn examples:dev` from the repository root.
- `yarn examples:build` from the repository root.
- `yarn examples:preview` from the repository root.

Structure:

- `main.js`: shared browser entry that reads the current example page and runs `react-rehydrate`.
- `demo-registry.js`: combined rehydrator registry assembled from the demo source modules.
Run In Development:

- Open the Vite URL it prints, usually `http://localhost:5173/`.
- Demo routes:
- `/`
- `/static/`
- `/hello-user/`
- `/show-more-text/`
- `/show-more/`
- `/asynchronous/`

Build And Preview:

- `index.html`: landing page that links to each demo.
- `<demo>/index.html`: server-rendered markup for a specific demo.

Static Hosting:

- After `yarn examples:build`, serve `examples/dist`, not the source `examples` folder.
- `http-server` is valid only for `examples/dist`.
- Example:
- `cd examples/dist && http-server ./`

Important:

- Do not serve the source `examples` folder directly with `http-server`.
- The source pages depend on Vite module processing for JSX, TypeScript entry imports, and bundle rewriting.
- The built `dist` pages are the ones that point to the emitted `dist/assets/*.js` bundles.
- `<demo>/demo.js`: React components and rehydrators used by the bundle.

Included examples:

- `static`: plain static markup inside a rehydration container.
- `hello-user`: markup for a component that receives its final value from `options.extra`.
- `show-more-text`: a simple string prop stored in a `data-` attribute.
- `show-more`: nested markup rehydrated through `rehydrateChildren`.
- `asynchronous`: multiple independent containers that resolve at different times.