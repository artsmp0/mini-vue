import { createApp, h, shallowRef, triggerRef } from "mini-vue";
const app = createApp({
  setup() {
    const state = shallowRef({ count: 0 });
    const forceUpdate = () => {
      triggerRef(state);
    };

    return () =>
      h("div", {}, [
        h("p", {}, [`count: ${state.value.count}`]),

        h(
          "button",
          {
            onClick: () => {
              state.value = { count: state.value.count + 1 };
            },
          },
          ["increment"]
        ),

        h(
          "button", // Clicking does not trigger re-rendering
          {
            onClick: () => {
              state.value.count++;
            },
          },
          ["not trigger ..."]
        ),

        h(
          "button", // The rendering is updated to the value currently held by state.value.count
          { onClick: forceUpdate },
          ["force update !"]
        ),
      ]);
  },
});

app.mount("#app");
