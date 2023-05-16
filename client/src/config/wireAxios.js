import axios from "axios";
//import Vue from "vue";

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
if (process.env.NODE_ENV === "container") {
  axios.defaults.baseURL = "http://localhost:3000";
}

axios.interceptors.response.use(function (response) {
  if (response.headers["x-wire-messages"]) {
    // var flash = JSON.parse(response.headers["x-wire-messages"]);
    // Vue.notifyFromFlash(flash);
  }
  return response;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status == 401) {
      window.location.reload();
    }
    throw error;
  }
);

export default axios;
