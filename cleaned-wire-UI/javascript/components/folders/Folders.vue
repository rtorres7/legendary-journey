<template>
  <div class="mt-6 standard-page-margin my-folders">
    <vanity-title title="My Folders"></vanity-title>
    <div>
      <b-row>
        <b-col cols="24" md="20">
          <p class="mt-6">
            Folders are an easy way for you to organize articles for later
            reading. Open a folder to manage and view its contents. Contents are
            ordered by the article posted on date.
          </p>
          <div v-if="loading">
            <spinner />
          </div>
          <b-row class="mb-8 folder-list" v-else>
            <b-col
              v-for="folder in this.folderList.folders"
              :key="folder.id"
              cols="24"
              lg="12"
            >
              <Folder :folder="folder" />
            </b-col>
          </b-row>
        </b-col>
        <b-col class="pl-3" cols="24" md="4">
          <CreateFolderForm />
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import Folder from "./Folder";
import CreateFolderForm from "./CreateFolderForm";
import Spinner from "../shared/Spinner";
import VanityTitle from "../vanity/VanityTitle";
import SelectAll from "../selectWithinResults/SelectAll";
import { mapGetters } from "vuex";

export default {
  name: "Folders",
  components: {
    SelectAll,
    VanityTitle,
    Spinner,
    CreateFolderForm,
    Folder,
  },

  mounted() {
    this.$store.dispatch("folders/loadFolders", { caller: this });
  },
  computed: {
    ...mapGetters("folders", { folderList: "folders" }),
    ...mapGetters("folders", ["loading"]),
  },
};
</script>
<style scoped>
.my-folders {
  padding-bottom: 6rem;
}
</style>
