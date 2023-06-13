<template>
  <div class="d-flex flex-column application">
    <vue-announcer />
    <SkipLinks :targets="$refs" />
    <notifications width="40%" group="main"></notifications>
    <header rol="_temp_519">
      <Header />
    </header>
    <nav _temp_20="nav" class="nav-container">
      <Navbar />
    </nav>
    <Alerts />
    <NtkNotifications />
    <div class="sr-only" ref="skipLink" tabindex="-1">Main Content</div>
    <main class="main flex-grow-1 d-flex" _temp_20="main">
      <router-view class="wire-router-view flex-grow-1" />
    </main>
    <ProgressBar />
    <footer _temp_20="footer">
      <Footer />
    </footer>
  </div>
</template>

<script>
import Alerts from "./components/header/Alerts";
import axios from "axios";
import NtkNotifications from "./components/header/NtkNotifications";
import Header from "./components/header/Header";
import Navbar from "./components/header/navbar/Navbar";
import ProgressBar from "./components/ProgressBar";
import Footer from "./components/footer/Footer";
import metadataLoader from "@shared/mixins/metadataLoader";
import SkipLinks from "./components/SkipLinks";

export default {
  name: "App",
  components: {
    SkipLinks,
    Alerts,
    Footer,
    NtkNotifications,
    ProgressBar,
    Header,
    Navbar,
  },
  methods: {
    pollForCSRFRefresh() {
      const interval = 50 * 60 * 1000;

      setInterval(
        function () {
          this.CSRFRefresh();
        }.bind(this),
        interval
      );
    },
    CSRFRefresh() {
      axios.get("/refresh_session.html").then((response) => {
        var newTokenElem = new DOMParser()
          .parseFromString(response.data, "text/html")
          .querySelector("meta[name='csrf-token']");
        var token = newTokenElem.content;
        var formToken = document.querySelector(
          "input[name='authenticity_token']"
        );
        if (formToken) {
          formToken.value = token;
        }

        var headElem = document.querySelector("head");
        var oldTokenElem = document.querySelector("meta[name='csrf-token']");

        headElem.removeChild(oldTokenElem);
        headElem.appendChild(newTokenElem);
        // Update the token used by the axios calls
        axios.defaults.headers.common["X-CSRF-Token"] = token;
      });
    },
  },
  mixins: [metadataLoader],
  mounted() {
    this.pollForCSRFRefresh();
    $(document).ajaxError(function globalHandler(
      event,
      xhr,
      ajaxOptions,
      thrownError
    ) {
      if (xhr.status == 401) {
        window.location.reload();
      }
    });
  },
  watch: {
    $route(route) {
      this.$refs.skipLink.focus();
      if (route.name === "home") {
        this.$store.dispatch("products/getHomeProducts");
      }
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .notifications {
  max-width: 500px;
  .vue-notification {
    font-size: $font-size-large;

    .notification-title {
      font-size: $font-size-small;
    }
  }
}
.nav-container {
  background-color: $pri-800;
  top: 0;
  z-index: 10;
}

@media (min-width: $screen-md) {
  .nav-container {
    position: sticky;
  }
}
</style>
