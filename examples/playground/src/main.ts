import { createApp, reactive, h, nextTick } from "mini-vue";

const app = createApp({
  setup() {
    const state = reactive({
      count: 0,
    });
    const updateState = async () => {
      state.count++;

      await nextTick(); // 等待
      const p = document.getElementById("count-p");
      if (p) {
        console.log("😎 p.textContent", p.textContent);
      }
    };

    return () => {
      return h("div", { id: "app" }, [
        h("p", { id: "count-p" }, [`${state.count}`]),
        h("button", { onClick: updateState }, ["update"]),
      ]);
    };
  },
});

app.mount("#app");
