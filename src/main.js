import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap";

import "./assets/main.css";

import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const app = createApp(App)

app.use(router)

app.mount('#app')
