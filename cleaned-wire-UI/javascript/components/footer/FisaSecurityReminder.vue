<template>
  <div>
    <b-button v-b-modal.fisa-security-reminder variant="link">
      FISA, Security & Copyright
    </b-button>
    <b-modal
      class="fisa-security-reminder"
      id="fisa-security-reminder"
      ok-only
      ok-title="Close"
      :static="true"
    >
      <h2>FISA Material</h2>
      <p>
        Such information, and any information derived therefrom, may only be
        used in a US legal or administrative proceeding with the advance
        authorization of the Attorney General. Any recipient interested in
        obtaining authorization for such use in a US legal or administrative
        proceeding should contact FBI Headquarters. Any further dissemination
        outside of intelligence channels and/or for law enforcement purposes
        must be made through FBI Headquarters. Any reproduction, dissemination,
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
        Material used within this site may be subject to copyright laws. Further
        reproduction and dissemination by any means, for any purpose other than
        official business, may be subject to copyright restrictions and is
        generally prohibited without the permission of the copyright holder.
      </p>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "FisaSecurityReminder",
};
</script>

<style scoped lang="scss">
/deep/ .btn-link {
  color: $text-light;
}
.fisa-security-reminder {
  color: $pri-800;
}
</style>
