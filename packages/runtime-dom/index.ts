import { CreateAppFunction, createAppAPI } from "../runtime-core/apiCreateApp";
import { createRenderer } from "../runtime-core/renderer";
import { nodeOps } from "./nodeOps";

const { render } = createRenderer(nodeOps);
const _createApp = createAppAPI(render);

export const createApp = ((...args) => {
  const app = _createApp(...args);
  const { mount } = app;
  app.mount = (selector: string) => {
    const container = document.querySelector(selector);
    if (!container) return;
    mount(container);
  };
}) as CreateAppFunction<Element>;
