<template>
  <div>
    <b-button v-b-modal._temp_214-security-reminder variant="link">
      _temp_214, Security & Copyright
    </b-button>
    <b-modal
      class="_temp_214-security-reminder"
      id="_temp_214-security-reminder"
      ok-only
      ok-title="Close"
      :static="true"
    >
      <h2>_temp_214 Material</h2>
      <p>
        Such information, and any information derived therefrom, may only be
        used in a US legal or administrative proceeding with the advance
        authorization of the Attorney General. Any recipient interested in
        obtaining authorization for such use in a US legal or administrative
        proceeding should contact _temp_537 Headquarters. Any further dissemination
        outside of _temp_536 channels and/or for law enforcement purposes
        must be made through _temp_537 Headquarters. Any reproduction, dissemination,
        or communication (including, but not limited to oral briefings) of this
        information must be accompanied by a statement of these restrictions.
      </p>
      <h2>Security Reminder</h2>
      <p>
        Use of this U.S. Government system, authorized or unauthorized,
        constitutes consent to monitoring of this system. Unauthorized use may
        subject you to criminal prosecution. Evidence of unauthorized use
        collected during monitoring may be used in administrative, criminal, or
        other adverse actions.
      </p>
      <h2>Copyright Material</h2>
      <p>
        <Copyright />
      </p>
    </b-modal>
  </div>
</template>

<script>
import Copyright from "../shared/Copyright";
export default {
  name: "FisaSecurityReminder",
  components: {
    Copyright,
  },
};
</script>

<style scoped lang="scss">
::v-deep .btn-link {
  color: $text-light;
}
._temp_214-security-reminder {
  color: $pri-800;
}
</style>
