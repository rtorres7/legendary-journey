<template>
  <div class="mr-auto pr-7 mt-3 recent-export">
    <div class="d-flex separator">
      <b-btn
        class="my-export-title _temp_488-0 text-lg-left"
        @click="toggleCollapse"
        variant="link"
        size="lg"
        :aria-expanded="expanded"
        :aria-label="'MyExport: ' + documentsExport.name"
      >
        {{ documentsExport.name }} <span class="sr-only"> export</span>
        <span class="my-export-type"
          >({{ exportFormat(documentsExport.type)
          }}<span class="sr-only"> file</span>)</span
        >
      </b-btn>
      <span
        v-if="showDownloadLinks"
        class="d-flex align-items-center ml-auto download-links"
      >
        <div
          v-for="volume in documentsExport.volumes"
          :key="documentsExport.id + '-' + volume"
          class="_temp_488-2"
        >
          <a
            :href="`/exports/${documentsExport.id}/${volume}`"
            :title="'Volume ' + volume"
            ><img alt="download export" :src="require('@assets/save.svg')" />
            <span class="sr-only"
              >Download export {{ documentsExport.name }}</span
            >
          </a>
        </div>
      </span>
      <div
        class="d-flex align-items-center ml-auto p-0 processing-status"
        v-else
      >
        {{ processingStatus }}
        <span class="sr-only">Download not available yet</span>
      </div>
    </div>
    <b-collapse v-model="expanded">
      <div class="d-flex mt-2">
        <div class="disabled">
          <span class="sr-only"> file</span> Status:
          {{ formatStatus(documentsExport.state) }}
          {{ documentsExport.total }} Documents from
          {{ documentsExport.source }}
        </div>
        <div class="d-flex text-right ml-auto">
          <DeleteButton
            :url="'/exports/' + documentsExport.id"
            :label="documentsExport.name"
            type="export"
            :caller="this"
            :useIcon="false"
          />
        </div>
      </div>
      <div class="d-flex align-items-center export-info">
        <div class="disabled">
          <span class="sr-only"> date</span> Created:
          {{ formatDateTime(documentsExport.created_at) }}
        </div>
      </div>
      <div class="d-flex align-items-center mb-5 export-info">
        <div class="disabled">
          <span class="sr-only">date</span> Expires: &nbsp;{{
            formatDateTime(documentsExport.expired_at)
          }}
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script>
import DeleteButton from "../shared/DeleteButton";
import { capitalize } from "lodash";

export default {
  name: "MyExport",
  components: { DeleteButton },
  props: ["myexport"],

  data() {
    return {
      expanded: false,
      processingStatus: "",
      documentsExport: {},
    };
  },
  mounted() {
    this.documentsExport = this.myexport;
    this.processingStatus = this.exportCompleted()
      ? "Done"
      : this.exportFailed()
      ? "Failed"
      : "Processing...";
    if (!this.exportCompleted() && !this.exportFailed()) {
      setTimeout(
        function () {
          this.$bus.$on("export-completed", (exportData) => {
            this.$store.dispatch("exports/loadExports", { caller: this });
          });
          this.$bus.$on("export-failed", (exportData) => {
            this.$store.dispatch("exports/loadExports", { caller: this });
            this.processingStatus = "Failed";
          });
          Export.checkStatus(this.documentsExport.id, this);
        }.bind(this),
        1000
      );
    }
  },
  computed: {
    showDownloadLinks() {
      return this.exportCompleted();
    },
  },
  methods: {
    exportCompleted() {
      return this.documentsExport.state == "completed";
    },
    exportFailed() {
      return this.documentsExport.state == "failed";
    },
    deleteExport() {
      this.$store.dispatch("exports/deleteExport", {
        exportId: this.documentsExport.id,
        caller: this,
      });
    },
    toggleCollapse() {
      this.expanded = !this.expanded;
    },
    exportFormat(type) {
      let format = "";
      switch (type) {
        case "PdfBookExport":
          format = "PDF Book";
          break;
        case "PdfListExport":
          format = "PDF Files";
          break;
        case "CsvExport":
          format = "CSV";
          break;
        case "ZipExport":
          format = "Zip";
          break;
        default:
          format = "Unknown";
      }
      return format;
    },
    formatStatus(status) {
      return capitalize(status);
    },
    formatDateTime(dateTime) {
      return this.$moment(dateTime).format("YYYY-MM-DD HH:mm");
    },
    deleted() {
      this.$wireNotification({
        title: "Export Deleted",
        duration: 5000,
        text: "Export '" + this.documentsExport.name + "' has been  deleted",
        type: "success",
      });
      this.$store.dispatch("exports/loadExports", { caller: this });
    },
    deletionFailed() {
      this.$wireNotification({
        title: "Export deletion failed",
        duration: 5000,
        text: "Failed to delete export '" + this.documentsExport.name + "'",
        type: "error",
      });
      this.$store.dispatch("exports/loadExports", { caller: this });
    },
  },
};
</script>

<style scoped lang="scss">
.separator {
  border-bottom: 1px solid $alt-400;
  margin-bottom: 5px;
}
.my-export-title {
  font-family: "noto_serifregular";
}
.my-export-type {
  font-family: "Roboto Condensed";
}
.disabled {
  color: $alt-800;
}
.export-info {
  margin-top: $spacer-1;
}
img {
  height: 16px;
  width: 16px;
}
.download-links {
  display: flex;
}
</style>
