<template>
  <div class="pa-5">
    <b-row class="pb-5">
      <b-col
        v-for="userRole in this.userRoles"
        :key="userRole._temp_20.id"
        md="12"
        class="pr-8 pt-2"
      >
        <RoleMember
          :userRole="userRole"
          @roleUpdated="$emit('reloadMembers')"
        />
      </b-col>
    </b-row>

    <div class="overflow-auto text-center mt-5" v-if="pages > 1">
      <div class="d-flex justify-content-center">
        <b-pagination-nav
          :link-gen="paginationLink"
          :number-of-pages="pages"
          :value="$route.query.page || 1"
        ></b-pagination-nav>
      </div>
    </div>
  </div>
</template>

<script>
import RoleMember from "./RoleMember";

export default {
  name: "RoleMembershipResults",
  components: { RoleMember },
  props: {
    userRoles: {
      type: Array,
      required: true,
    },
    pages: {
      type: Number,
      required: true,
    },
  },
  methods: {
    paginationLink(pageNum) {
      var query = Object.assign({}, this.$route.query);
      query.page = pageNum;
      return {
        name: this.$route.name,
        query: query,
      };
    },
  },
};
</script>

<style scoped lang="scss"></style>
