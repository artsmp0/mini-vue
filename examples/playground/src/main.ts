import { createApp, h, reactive } from "mini-vue";

const app = createApp({
  setup() {
    const state = reactive({ count: 0 });
    const increment = () => {
      state.count++;
    };
    return () =>
      h("div", {}, [
        h("p", { style: "color: red; font-weight: bold;" }, [
          `count: ${state.count}`,
        ]),
        h(
          "button",
          {
            onClick: increment,
          },
          ["increment"]
        ),
      ]);
  },
});
console.log("app: ", app);

app.mount("#app");
