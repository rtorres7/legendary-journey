<template>
  <div class="pills container-fluid pt-6 pb-4">
    <div class="standard-page-margin align-items-center d-flex flex-wrap">
      <div class="user-state d-inline-flex mb-4">User State</div>
      <div
        class="user-state-pills-title d-inline-flex align-items-center _temp_488-8 mb-3"
      >
        LOCK STATE
        <span class="_temp_488-3 user-state-pills"
          ><span :class="lockedIcon"></span> {{ lockedState }}</span
        >
      </div>
      <div
        class="user-state-pills-title d-inline-flex align-items-center _temp_488-6 mb-3"
      >
        _temp_28
        <span class="_temp_488-3 user-state-pills">
          <img
            :src="require(`@assets/${statusIcon(user._temp_28)}.svg`)"
            class="status-icon"
          />
          {{ yesOrNo(user._temp_28) }}
        </span>
      </div>
      <div
        class="user-state-pills-title d-inline-flex align-items-center _temp_488-6 mb-3"
      >
        CONGRESS
        <span class="_temp_488-3 user-state-pills">
          <img
            :src="require(`@assets/${statusIcon(user.congress)}.svg`)"
            class="status-icon"
          />
          {{ yesOrNo(user.congress) }}
        </span>
      </div>
      <div
        class="user-state-pills-title d-inline-flex align-items-center _temp_488-6 mb-3"
      >
        _temp_120
        <span class="_temp_488-3 user-state-pills">
          <img
            :src="require(`@assets/${statusIcon(hasHcs)}.svg`)"
            class="status-icon"
          />
          {{ yesOrNo(hasHcs) }}
        </span>
      </div>
      <div
        class="user-state-pills-title d-inline-flex align-items-center _temp_488-6 mb-3"
      >
        _temp_116
        <span class="_temp_488-3 user-state-pills">
          <img
            :src="require(`@assets/${statusIcon(hasGamma)}.svg`)"
            class="status-icon"
          />
          {{ yesOrNo(hasGamma) }}
        </span>
      </div>
      <div
        class="user-state-pills-title d-inline-flex align-items-center _temp_488-6 mb-3"
      >
        _temp_144-R
        <span class="_temp_488-3 user-state-pills">
          <img
            :src="require(`@assets/${statusIcon(hasKlmR)}.svg`)"
            class="status-icon"
          />
          {{ yesOrNo(hasKlmR) }}
        </span>
      </div>
      <div
        class="user-state-pills-title d-inline-flex align-items-center _temp_488-6 mb-3"
      >
        NEXT _temp_246 CHECK
        <span class="_temp_488-3 user-state-pills">
          <img
            :src="require('@assets/calendar-icon-dark.svg')"
            class="cal-icon mr-2"
            alt="calendar"
          />
          {{ nextSCICheck }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "UserState",

  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  methods: {
    yesOrNo(value) {
      return value ? "Yes" : "No";
    },
    statusIcon(value) {
      return value ? "check-icon" : "delete-icon-dark";
    },
  },
  computed: {
    lockedIcon() {
      return this.user.lock_state === "unlocked" ? "" : "fa fa-lock";
    },
    lockedState() {
      switch (this.user.lock_state) {
        case "exempt":
          return "Exempted";
        case "automatically_locked":
        case "manually_locked":
          return "Locked";
        default:
          return "Unlocked";
      }
    },
    hasHcs() {
      return (
        this.user.sci_codes &&
        (this.user.sci_codes.includes("_temp_120-P") ||
          this.user.sci_codes.includes("_temp_120"))
      );
    },
    hasGamma() {
      return (
        this.user.sci_codes &&
        (this.user.sci_codes.includes("_temp_257-G") ||
          this.user.sci_codes.includes("G"))
      );
    },
    hasKlmR() {
      return this.user.sci_codes && this.user.sci_codes.includes("_temp_144-R");
    },
    nextSCICheck() {
      let nextCheck = this.$moment();

      if (this.user.last_login) {
        nextCheck = this.$moment(this.user.last_login).add(4, "hours");
      }

      return nextCheck.format("MMMM DD, YYYY HH:mm");
    },
  },
};
</script>

<style scoped lang="scss">
.pills {
  background-color: $alt-200;
  position: sticky;
  top: 70px;
  border-bottom: solid 1px $alt-500;
  border-top: solid 1px $alt-500;
  z-index: 2;

  @media (max-width: $screen-sm) {
    top: 0px;
  }
}
.user-state {
  color: $pri-900;
  font-size: $font-size-5;
  font-family: $font-family-heading;
}
.user-state-pills-title {
  color: $pri-600;
  font-family: $font-family-heading;
}
.user-state-pills {
  color: $pri-900;
  font-family: $font-family-heading;
  font-size: $font-size-3;
  font-style: italic;
}
.status-icon {
  height: 14px;
  width: 14px;
}
.cal-icon {
  height: 20px;
  width: 20px;
}
</style>
