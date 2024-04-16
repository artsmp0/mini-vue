import { createApp, reactive, h, nextTick } from "mini-vue";

const app = createApp({
  setup() {
    const state = reactive({
      count: 0,
      color: "red",
    });
    const updateState = async () => {
      state.count++;
      state.color === "red" ? (state.color = "green") : (state.color = "red");

      await nextTick(); // 等待
      const p = document.getElementById("count-p");
      if (p) {
        console.log("😎 p.textContent", p.textContent);
      }
    };

    return () => {
      return h("div", { id: "app" }, [
        h("p", { id: "count-p", style: { color: state.color } }, [
          `${state.count}`,
        ]),
        h("button", { onClick: updateState }, ["update"]),
      ]);
    };
  },
});

app.mount("#app");
