import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "vue-select/dist/vue-select.css";
import "@popperjs/core/dist/umd/popper.min.js";
import "bootstrap/js/dist/tab.js";
import "bootstrap";

import "./assets/main.css";

import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);

app.mount('#app');
