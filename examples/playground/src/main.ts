import { createApp, reactive } from "mini-vue";

const app = createApp({
  setup() {
    const state = reactive({
      message: "Hello, mini vue.",
    });

    const changeMessage = () => {
      state.message += ".";
    };

    return { state, changeMessage };
  },
  template: `
    <div class="container" style="text-align: center">
      <h2>message: {{ state.message }}</h2>
      <img
        width="150px"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1200px-Vue.js_Logo_2.svg.png"
        alt="Vue.js Logo"
      />
      <p><b>chibivue</b> is the minimal Vue.js</p>
      <button @click="changeMessage">Change message</button>
      <style>
        .container {
          height: 100vh;
          padding: 16px;
          background-color: #becdbe;
          color: #2c3e50;
        }
      </style>
    </div>
  `,
});
app.mount("#app");
