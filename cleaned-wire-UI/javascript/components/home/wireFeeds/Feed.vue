<template>
  <b-col
    :class="{ 'col-12': !preview, 'col-md-8': !preview }"
    class="px-5 custom-gutter-col"
  >
    <b-card class="feed pt-5 h-100 d-flex flex-column">
      <b-card-title class="my-3 _temp_488-7 font-size-6" title-tag="h3">
        <div class="d-flex justify-content-between">
          <a
            v-if="!confirmDelete"
            _temp_576="blank"
            class="title-link"
            :href="portlet.url"
          >
            <span class="sr-only">Visit portlet </span>{{ feed.portlet.title }}
          </a>

          <div class="mr-5">
            <div v-if="!confirmDelete">
              <b-button
                @click="askForConfirm"
                :disabled="deleteDisabled"
                variant="link"
              >
                <img
                  :src="require('@assets/reset.svg')"
                  class="reset-icon mr-1 mb-2"
                />
                <span class="sr-only"
                  >Delete portlet titled {{ portlet.title }}. You will have 5
                  seconds to confirm.</span
                >
              </b-button>
            </div>
            <div v-else>
              <b-button
                @click="removeFeed"
                variant="danger"
                ref="confirmButton"
                class="deleteConfirm"
              >
                Confirm deletion of {{ portlet.title }}?
              </b-button>
              <b-button variant="link" @click="confirmDelete = false">
                Cancel in {{ confirmTimer }}
              </b-button>
            </div>
          </div>
        </div>
      </b-card-title>
      <div v-if="feed.items">
        <PortletItem
          v-if="portlet.portlet_type === 'search'"
          v-for="(article, ind) in feed.articles"
          :item="article"
          :ptype="portlet.portlet_type"
          ref="item"
          :key="ind"
          :data-usage="dataUsage"
        >
        </PortletItem>
        <PortletItem
          v-if="portlet.portlet_type != 'search'"
          v-for="(item, ind) in feed.items"
          :item="item"
          :ptype="portlet.portlet_type"
          ref="item"
          :key="ind"
          :data-usage="dataUsage"
        >
        </PortletItem>
        <div class="text-center font-size-3 pt-5" v-if="feed.items.length == 0">
          No results for feed {{ portlet.title }} currently. Please try again
          later.
        </div>
      </div>
      <div v-else>
        <div class="text-center font-size-3 pt-5">
          Error loading this portlet
        </div>
      </div>
      <div class="mt-auto d-flex justify-content-end">
        <router-link
          v-if="portlet.portlet_type === 'search'"
          class="ml-auto"
          :to="'/search/' + portlet.search_id"
        >
        </router-link>
      </div>
    </b-card>
  </b-col>
</template>

<script>
import PortletItem from "./PortletItem";
import axios from "axios";
export default {
  name: "Feed",
  components: { PortletItem },
  props: ["feed", "preview", "deleteDisabled"],
  data() {
    return {
      confirmDelete: false,
      confirmTimer: 0,
    };
  },

  computed: {
    portlet() {
      return this.feed.portlet;
    },

    dataUsage() {
      // returns something similar to front-page-wire-feeds-_temp_327-wire-afghanistan
      return _.kebabCase(
        "front-page-wire-feeds-" + this.feed.portlet.title.toLowerCase()
      );
    },
  },

  methods: {
    askForConfirm() {
      this.confirmDelete = true;
      this.confirmTimer = 5;
      this.$nextTick(
        function () {
          this.$refs.confirmButton.focus();
        }.bind(this)
      );
      this.countdown();
      setTimeout(
        function () {
          this.confirmDelete = false;
          this.confirmTimer = 0;
        }.bind(this),
        5000
      );
    },

    countdown() {
      if (this.confirmTimer && this.confirmTimer > 0) {
        setTimeout(
          function () {
            if (this.confirmTimer) {
              this.confirmTimer = this.confirmTimer - 1;
              this.countdown();
            }
          }.bind(this),
          1000
        );
      }
    },

    removeFeed() {
      this.confirmDelete = false;
      axios
        .delete("/my_wire/portlets/" + this.feed.portlet.id)
        .then(() => {
          this.$store.dispatch("portlets/loadPortlets");
          this.$wireNotification({
            group: "main",
            title: "Portlet Deleted",
            duration: 5000,
            text: this.feed.portlet.title + " deleted",
            type: "success",
          });
        })
        .catch(() => {
          alert("Error removing portlet");
        });
    },
  },
};
</script>

<style scoped lang="scss">
.err {
  color: $red;
}

.feed {
  border: solid 1px $alt-500;
  border-radius: 0;
}

.deleteConfirm {
  position: relative;
  max-width: 70%;
}

.timer {
  position: absolute;
  top: 0;
  right: 2px;
}

.reset-icon {
  height: 16px;
  width: 16px;
}

.title-link {
  max-width: 90%;
  font-family: $font-family-sans-serif;
  font-weight: 500;
  font-size: $font-size-5;
}

/deep/ .card-body {
  padding: 0;
}
</style>
