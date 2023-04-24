<template>
  <b-nav-item-dropdown
    :class="pretend ? 'sec-600-bg' : ''"
    v-if="!loading"
    id="nav-you"
  >
    <template slot="button-content">
      <img
        :src="require('@assets/person-icon.svg')"
        alt=""
        class="person-icon"
        data-usage="my-wire"
      />
      <span class="sr-only">Profile drop down</span>
      <span v-if="pretend" data-usage="my-wire">
        <span class="aria-hidden">(</span>
        <span class="sr-only">in mode</span>
        {{ this.emulate_text }}
        <span class="aria-hidden">)</span>
      </span>
    </template>
    <YouNav
      v-if="featuresAvailable.ntk"
      routeName="ntk"
      display="Accesses"
      :user_id="user_id"
    ></YouNav>
    <YouNav routeName="folders" display="Folders" :user_id="user_id"></YouNav>
    <YouNav
      v-if="featuresAvailable.tags"
      routeName="myTags"
      display="Tags"
      :user_id="user_id"
    ></YouNav>
    <YouNav routeName="exports" display="Exports" :user_id="user_id"></YouNav>
    <Pretend v-if="user.pretend" />
  </b-nav-item-dropdown>
</template>

<script>
import YouNav from "../../you/YouNav";
import { mapState } from "vuex";
import Pretend from "@/components/header/navbar/Pretend";

export default {
  name: "YouLink",
  components: { YouNav, Pretend },
  computed: {
    ...mapState("user", ["user", "loading", "pretend"]),
    ...mapState("metadata", ["featuresAvailable"]),
    user_id() {
      return this.user.id;
    },
    emulate_text() {
      if (this.pretend == "no_ntk") return "no access";
      return this.pretend.replace("_", " ");
    },
  },
  methods: {},
};
</script>

<style scoped lang="scss">
.person-icon {
  height: 30px;
  width: 30px;
  margin-top: -4px;
}
#nav-you {
  font-size: $font-size-3;
}
</style>
