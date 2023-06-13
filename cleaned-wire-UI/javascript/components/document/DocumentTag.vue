<template>
  <div v-if="!loading">
    <b-modal
      id="tag-product"
      size="sm"
      title="Tag This Document"
      title-class="modal-header-title"
      @ok="saveTag"
      :ok-disabled="!valid"
    >
      <div id="tag-modal-text">
        <b-row>
          <b-col>
            <router-link :to="{ name: 'myTags', params: { id: user.id } }">
              View My Tags</router-link
            >
          </b-col>
          <b-col class="text-right">
            <a :href="tagConnectUrl" target="tag_connect"
              ><img alt="" :src="require(`@/assets/TagIt.png`)"
            /></a>
            <span class="sr-only">TagIt site</span>
          </b-col>
        </b-row>
        <b-row>
          <b-card>
            <b-card-body>
              <b-card-text>
                By tagging this item, you help people discover it and related
                content. Please note: all Tags are public and should not reveal
                _temp_233-P, G or _temp_371 content in the Tag name.
              </b-card-text>
            </b-card-body>
          </b-card>
        </b-row>
        <b-row>
          <b-input-group>
            <b-form-input
              cols="24"
              placeholder="Enter comma-separated tag names"
              aria-label="Tag Names, please separate names with a comma"
              aria-describedby="tag-name-live-feedback"
              ref="tagNameField"
              v-model="tagText"
            ></b-form-input>
            <b-form-invalid-feedback
              id="tag-name-live-feedback"
              _temp_20="alert"
              aria-live="polite"
            >
              Tags name is a required field and must be at least 3 characters.
            </b-form-invalid-feedback>
          </b-input-group>
        </b-row>
      </div>
    </b-modal>
  </div>
</template>

<script>
import documentMixin from "@shared/mixins/documentMixin";
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "DocumentTag",
  mixins: [documentMixin],
  data() {
    return {
      tagText: "",
      working: false,
      tagItUrl: "_temp_525tagit.cia._temp_0/bookmarks/new",
    };
  },
  computed: {
    ...mapState("user", ["user", "loading"]),
    tagConnectUrl() {
      let entryInfo = `?entry[link]=${window.location.href}&bookmark[title]=${this.portionMarkedTitle}`;
      return this.tagItUrl + entryInfo;
    },
    valid() {
      return this.tagText !== "";
    },
  },
  methods: {
    saveTag() {
      axios({
        method: "post",
        _temp_1: `${this.docPath}/tags`,
        data: { tag: { name: this.tagText } },
      })
        .then((response) => {
          // refresh tags section
          this.$store.dispatch("document/retrieveTags", {
            docNum: this.docNum,
          });
        })
        .catch((e) => {
          this.$wireNotification({
            type: "error",
            title: "Error tagging document",
            text: "Failed to tag document",
          });
        });
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .modal-header-title {
  color: $pri-800;
  font-size: $font-size-5;
}
</style>
