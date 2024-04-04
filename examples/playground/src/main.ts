import { createApp } from "mini-vue";

const app = createApp({
  render() {
    return "hello mini vue is only createApp";
  },
});

app.mount("#app");
