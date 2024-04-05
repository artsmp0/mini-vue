import { createApp, h } from "mini-vue";

const app = createApp({
  render() {
    return h("div", {}, [
      h("p", { style: "color: red; font-weight: bold;" }, ["Hello World"]),
      h(
        "button",
        {
          onClick() {
            alert("Hello patchEvent!");
          },
        },
        ["click me"]
      ),
    ]);
  },
});
console.log("app: ", app);

app.mount("#app");
