import { createApp, h, reactive } from "mini-vue";

const app = createApp({
  template: `<p class="hello" style="color: #f00;">hello this is simple template render app</p>`,
});

app.mount("#app");
