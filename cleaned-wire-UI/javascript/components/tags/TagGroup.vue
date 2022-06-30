<template>
  <div class="mr-7 mt-6">
    <b-btn
      class="tag-title w-100"
      variant="secondary"
      size="lg"
      :aria-expanded="tag_group.expanded"
      :id="tagGroupButtonId"
      v-b-toggle="accordionId(tag_group.name, 'tag_group')"
      @click="selectGroup(tag_group.name)"
    >
      {{ tagGroupName }}
    </b-btn>
    <b-collapse
      :id="accordionId(tag_group.name, 'tag_group')"
      accordion="tag-group-accordion"
      role="tabpanel"
      v-model="tag_group.expanded"
      :aria-hidden="!tag_group.expanded"
      :aria-labelledby="accordionId(tag_group.name, 'tag_group')"
      @shown="updateFocus(`#${tagGroupButtonId}`)"
    >
      <div v-for="(tag, index) in tag_group.tags" :key="index">
        <h4>
          <b-btn
            :id="`${accordionId(tag.name, 'tag')}_btn`"
            variant="link"
            size="lg"
            class="tag-subtitle w-100 border"
            v-b-toggle="accordionId(tag.name, 'tag')"
            @click="selectTag(tag_group.name, tag.name)"
          >
            <div class="d-flex">
              {{ tag.name }}
              <span class="tag-count">({{ tag.document_count }})</span>
              <WireBackgroundAsset
                image-name="less-more.svg"
                class="less-more-image ml-auto"
                fill
                :class="{ rotate: tag.expanded }"
                aria-hidden="true"
              />
            </div>
          </b-btn>
        </h4>
        <div class="mr-auto ml-5">
          <b-collapse
            :id="accordionId(tag.name, 'tag')"
            v-model="tag.expanded"
            accordion="tag-accordion"
            :aria-hidden="!tag.expanded"
            :aria-labelledby="accordionId(tag.name, 'tag')"
            @shown="updateFocus(`#${accordionId(tag.name, 'tag')}_btn`)"
          >
            <TagDocuments
              :tag="tag"
              :removable="removable"
              @loadTagDocs="loadDocs(tag.name)"
            />
            <div class="py-4">
              <router-link :to="'/tags/' + tag.name">
                See what else has been tagged "{{ tag.name }}"
              </router-link>
            </div>
          </b-collapse>
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script>
import TagDocuments from "./TagDocuments";
import WireBackgroundAsset from "../shared/WireBackgroundAsset";
import { startCase, snakeCase } from "lodash";
import { mapGetters } from "vuex";

export default {
  name: "TagGroup",
  components: { TagDocuments, WireBackgroundAsset },
  props: {
    tag_group: {
      type: Object,
      default: null,
    },
  },
  computed: {
    ...mapGetters("user", ["user"]),
    tagGroupButtonId() {
      return `tag_group_btn_${snakeCase(this.tag_group.name)}`;
    },
    tagGroupName() {
      switch (this.tag_group.name) {
        case "num":
          return "#";
        case "sym":
          return "@";
        default:
          return startCase(this.tag_group.name);
      }
    },
    removable() {
      // only the person that created the tag can remove the tag
      if (this.user.id) {
        return this.user.id.toString() === this.$route.params.id.toString();
      } else {
        return false;
      }
    },
  },
  methods: {
    accordionId(tagName, prefix) {
      return prefix + "-contents-" + snakeCase(tagName);
    },
    loadDocs(tagName) {
      this.$store.dispatch("tags/loadDocs", {
        tagName: tagName,
        route: this.$route,
        caller: this,
      });
    },
    selectGroup(tagGroupName) {
      let query = this.tag_group.expanded ? {} : { tag_group: tagGroupName };
      this.$router.push({ name: "myTags", query: query });
    },
    selectTag(tagGroupName, tagName) {
      let query = { tag_group: tagGroupName, tag_name: tagName };
      this.$router.push({ name: "myTags", query: query });
    },
    updateFocus(accordionSelector) {
      document.querySelector(accordionSelector).focus();
    },
  },
};
</script>

<style scoped lang="scss">
.tag-title {
  font-family: $font-family-sans-serif;
  font-size: $font-size-3;
  color: $pri-600;
}
.tag-count {
  font-family: $font-family-heading;
  padding-left: 5px;
}
.tag-subtitle {
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
.fa-times-circle {
  color: $alt-500;
}
/deep/ .dropdown-menu {
  min-width: 7rem;
}
/deep/ a.dropdown-item {
  padding-left: 5px;
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
