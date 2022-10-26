<template>
  <div>
    <h3>
      <b-btn
        variant="link"
        size="lg"
        class="alert-type-title w-100 pl-0"
        :aria-expanded="visible"
        :aria-label="title + ' Alerts'"
        @click="visible = !visible"
      >
        <div class="d-flex">
          {{ title }}
          <WireBackgroundAsset
            image-name="less-more.svg"
            class="less-more-image ml-auto"
            fill
            :class="{ rotate: visible }"
            aria-hidden="true"
          />
        </div>
      </b-btn>
    </h3>

    <b-collapse v-model="visible">
      <template v-if="alerts && alerts.length > 0">
        <div v-for="(alert, ind) in alerts" :key="ind">
          <span class="alert-title">{{ alert.title }}</span> {{ alert.message }}
          <div>
            <span class="alert-details">
              ({{ formatDateTime(alert.start_at) }} —
              {{ formatDateTime(alert.end_at) }})
            </span>
            <b-btn
              class="alert-detail-actions pl-0 pr-0"
              variant="link"
              :aria-label="'Edit ' + alert.title"
              @click="editAlert(alert)"
              >Edit
            </b-btn>
            |
            <DeleteButtonBase
              :useIcon="false"
              :label="alert.title"
              type="alert"
              @deleteButtonEvent="deleteAlert(alert)"
            />
          </div>
        </div>
      </template>
      <div v-else>
        <i>There are currently no {{ safeTitle }} alerts.</i>
      </div>
    </b-collapse>
  </div>
</template>

<script>
import WireBackgroundAsset from "../../shared/WireBackgroundAsset";
import DeleteButtonBase from "../../shared/DeleteButtonBase";

export default {
  name: "AlertGroup",
  components: { WireBackgroundAsset, DeleteButtonBase },
  props: {
    title: {
      type: String,
      required: true,
    },
    alerts: {
      type: Array,
      required: true,
    },
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: true,
    };
  },
  computed: {
    safeTitle() {
      return this.title ? this.title.toLowerCase() : "";
    },
  },
  methods: {
    editAlert: function (alert) {
      this.$bus.$emit("editAlertEvent", alert);
    },
    deleteAlert: function (alert) {
      this.$bus.$emit("deleteAlertEvent", alert);
    },
    formatDateTime(dateTime) {
      return this.$moment(dateTime).format("YYYY-MM-DD HH:mm");
    },
  },
  mounted() {
    if (this.collapsed) {
      this.visible = false;
    }
  },
};
</script>

<style scoped lang="scss">
.alert-type-title {
  font-size: $font-size-4;
  font-family: $heading-stylized;
  &:hover,
  &:active,
  &:focus {
    text-decoration: none;
  }
  &:focus {
    outline: 1px dotted $link-color !important;
  }
  &:visited {
    text-decoration: underline;
  }
}
.alert-title {
  font-size: $font-size-3;
  font-family: "Roboto Condensed";
  color: $pri-600;
  text-transform: uppercase;
}
.alert-details {
  font-size: $font-size-2;
  font-family: "Roboto Condensed";
  color: $alt-800;
  text-transform: uppercase;
}
.alert-detail-actions {
  font-size: $font-size-2;
}
.less-more-image {
  height: 24px;
  width: 14px;
  transform: rotate(270deg);
}
.rotate {
  transform: rotate(360deg);
}
</style>
