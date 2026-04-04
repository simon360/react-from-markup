import rehydrate from "../packages/react-from-markup/src/index.ts";
import { exampleRegistry, getRehydrators } from "./demo-registry";

const run = async () => {
  const container = document.getElementById("app");
  const exampleName = document.body.getAttribute("data-example");

  if (!container || !exampleName) {
    return;
  }

  const example = exampleRegistry[exampleName];

  if (!example) {
    throw new Error(`Unknown example: ${exampleName}`);
  }

  await rehydrate(
    container,
    getRehydrators(example.rehydratorNames),
    example.options
  );
};

run();