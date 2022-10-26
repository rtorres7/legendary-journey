<template>
  <div class="mt-4">
    <h2 class="pri-800 separator pb-4 d-flex">
      {{ producingOfficeLabel }} Tree
    </h2>
    <p class="sr-only">
      To move or delete {{ officeOrDivisionText }}, you must select
      {{ officeOrDivisionText }} and hit 'return'/'enter'.
    </p>
    <b-row class="pb-8">
      <Tree
        _temp_20="navigation"
        :aria-label="producingOfficeLabel"
        tabindex="0"
        large
        z-index="100"
        :data="producingOffices"
        @toggle="onToggle($event)"
        @change="onChange($event)"
      ></Tree>
    </b-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Tree } from "tree-vue-component";

export default {
  name: "OfficeTree",
  components: { Tree },
  computed: {
    ...mapState("producingOffices", [
      "producingOffices",
      "producingOfficeLabel",
      "officeOrDivisionText",
    ]),
  },
  mounted() {
    this.$nextTick(() => {
      let treeContainer = document.querySelector(".tree");
      if (treeContainer) {
        treeContainer.focus();

        let treeNode = document.querySelectorAll("a.tree-anchor");
        // Help screen readers know which tree item is currently selected
        treeNode.forEach((node) => {
          node.onfocus = function (evt) {
            let selectedNode = document.querySelector("[aria-selected=true]");
            if (selectedNode) {
              selectedNode.removeAttribute("aria-selected");
            }
            node.parentElement.setAttribute("aria-selected", "true");
          };
        });
      }
    });
  },
  methods: {
    onChange(eventData) {
      this.$store.commit("producingOffices/setSelectedNode", eventData.data);
      this.onToggle(eventData);
    },
    onToggle(eventData) {
      if (eventData.data.state.openable) {
        eventData.data.state.opened = !eventData.data.state.opened;
      }
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
</style>
