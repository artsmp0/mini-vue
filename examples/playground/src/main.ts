import { createApp, reactive, h } from "mini-vue";

const app = createApp({
  setup() {
    const state = reactive({
      list: [{ key: "a" }, { key: "b" }, { key: "c" }, { key: "d" }],
    });
    const updateList = () => {
      state.list = [{ key: "a" }, { key: "b" }, { key: "d" }, { key: "c" }];
    };

    return () =>
      h("div", { id: "app" }, [
        h(
          "ul",
          {},
          state.list.map((item) => h("li", { key: item.key }, [item.key]))
        ),
        h("button", { onClick: updateList }, ["update"]),
      ]);
  },
});

app.mount("#app");
