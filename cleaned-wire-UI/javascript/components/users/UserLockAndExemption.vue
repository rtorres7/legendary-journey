<template>
  <div>
    <h2 class="info-title d-flex separator mt-6 pb-2">Lock and Exemption</h2>
    <b-btn
      variant="secondary"
      @click="selectEvent('lock')"
      v-if="!locked"
      :disabled="!canManageLocks"
      >Lock User</b-btn
    >
    <b-btn
      variant="secondary"
      @click="selectEvent('unlock')"
      v-if="locked"
      :disabled="!canManageLocks"
      >Unlock User</b-btn
    >
    <b-btn
      variant="secondary"
      @click="selectEvent('exempt')"
      v-if="!locked"
      :disabled="!canManageLocks"
      >{{ exempted ? "Replace" : "Add" }} Exemption</b-btn
    >
    <b-btn
      variant="secondary"
      @click="selectEvent('cancel_exemption')"
      v-if="exempted"
      :disabled="!canManageLocks"
      >Cancel Exemption</b-btn
    >
    <div v-if="eventType !== ''" class="event-form">
      <div class="info-details mt-3" v-if="eventType === 'lock'">
        Place an access lock on an user's account.
      </div>
      <div class="info-details mt-3" v-if="eventType === 'exempt'">
        To override the {{ this.name }} security control that locks a user or
        system account’s access if they exceed the document view threshold of
        200 documents within a day.
      </div>
      Reason
      <label class="mt-3">(Will be shown to the locked user)</label>
      <b-input
        :aria-label="`${
          eventType === 'exempt' ? 'Exemption' : eventType.replace('_', ' ')
        } reason`"
        v-model="event.reason"
        class="user-reason"
        id="user-reason"
      ></b-input>

      <b-row
        class="mt-3 align-items-center mr-auto"
        v-if="eventType === 'exempt'"
      >
        <b-checkbox v-model="event.permanent" @change="event.expires_on = ''"
          >Permanent Exemption?</b-checkbox
        >

        <div class="d-flex align-items-center ml-auto">
          <b-button
            variant="outline"
            @click="showDatePicker = !showDatePicker"
            :disabled="event.permanent"
            >Expires On
            <img
              :src="require('@assets/calendar-icon.svg')"
              alt="calendar"
              class="calendar-icon"
            />
          </b-button>
        </div>
        <div
          v-if="showDatePicker && !event.permanent"
          class="d-flex align-items-center ml-auto"
        >
          <b-calendar
            width="320px"
            v-model="event.expires_on"
            :min="today"
          ></b-calendar>
        </div>
      </b-row>

      <b-btn
        class="mt-3 d-flex align-items-center ml-auto"
        variant="primary"
        @click="submitForm"
        :disabled="disableSubmit"
        >{{ buttonText }}</b-btn
      >
    </div>

    <UserLockHistory />
  </div>
</template>

<script>
import UserLockHistory from "./UserLockHistory";
import Spinner from "../shared/Spinner";
import { mapGetters, mapState } from "vuex";

export default {
  name: "UserLockAndExemption",
  components: {
    Spinner,
    UserLockHistory,
  },
  data() {
    return {
      today: new Date(),
      eventType: "",
      showDatePicker: false,
      event: {},
    };
  },
  mounted() {
    this.resetEvent();
    this.loadUserLockHistory();
  },
  computed: {
    ...mapGetters("user", ["canManageLocks"]),
    ...mapGetters("users", ["user"]),
    ...mapState("metadata", ["name"]),
    userId() {
      return this.$route.params.id;
    },
    locked() {
      return (
        this.user.lock_state === "manually_locked" ||
        this.user.lock_state === "automatically_locked"
      );
    },
    exempted() {
      return this.user.lock_state === "exempt";
    },
    buttonText() {
      switch (this.eventType) {
        case "exempt":
          return "Create Exemption";
        case "cancel_exemption":
          return "Remove Exemption";
        case "lock":
          return "Create Lock";
        case "unlock":
          return "Remove Lock";
        default:
          return "Submit";
      }
    },
    disableSubmit() {
      if (this.event.reason.trim() === "") {
        return true;
      } else {
        return (
          this.eventType === "exempt" &&
          this.event.permanent === false &&
          this.event.expires_on === ""
        );
      }
    },
  },
  methods: {
    loadUserLockHistory() {
      this.$store.dispatch("users/loadUserLockHistory", {
        userId: this.userId,
        caller: this,
      });
    },
    resetEvent() {
      this.event = {
        reason: "",
        expires_on: "",
        permanent: false,
      };
    },
    selectEvent(selection) {
      this.eventType = selection;
      this.resetEvent();
      if (selection === "cancel_exemption") {
        this.event.expires_on = this.today;
      }
      this.$nextTick(() => {
        if (document.querySelector("#user-reason")) {
          document.querySelector("#user-reason").focus();
        }
      });
    },
    submitForm() {
      this.$store.dispatch("users/submitLockAction", {
        userId: this.userId,
        lockEvent: this.event,
        lockAction: this.eventType,
        caller: this,
      });
      this.resetEvent();
      this.eventType = "";
    },
  },
};
</script>

<style scoped lang="scss">
label {
  color: $alt-800;
  font-style: italic;
  justify-content: left;
}
.user-reason {
  height: 100px !important;
}
.separator {
  border-bottom: 1px solid $alt-400;
  margin-bottom: 5px;
}
.info-title {
  font-family: $font-family-heading;
  font-size: $font-size-6;
  color: $pri-600;
  line-height: 1.5;
}
.info-details {
  font-size: $font-size-2;
  color: $pri-900;
}
.event-title {
  color: $pri-600;
  font-size: $font-size-3;
  font-family: $heading-stylized;
  background-color: white;
}

::v-deep .b-calendar {
  .btn-secondary {
    color: $text-dark;
    background-color: unset;
    border: unset;
    padding-top: 0;
    padding-bottom: 0;
    &:hover,
    &:focus {
      box-shadow: 0 0 0 0.2rem $alt-500;
    }
  }
  ::v-deep .btn-outline-secondary {
    color: $text-dark;
  }
}
.calendar-icon {
  height: 20px;
  width: 20px;
}
</style>
