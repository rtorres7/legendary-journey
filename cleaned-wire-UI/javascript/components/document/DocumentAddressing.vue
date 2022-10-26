<template>
  <DocumentExpansionPanel panelId="addressing-list" v-if="isCable">
    <template slot="header"> Addressing </template>
    <template slot="content">
      <ul class="list-group separator pb-2">
        <li class="list-group-item pb-2">
          <dl>
            <dt>To:</dt>
            <dd v-if="document.addressees">
              {{ document.addressees.join(", ") }}
            </dd>
          </dl>
        </li>
        <li
          class="pb-2"
          v-if="document.field_dissem && document.field_dissem.length > 0"
        >
          <dl>
            <dt>Field Dissem:</dt>
            <dd>
              {{ document.field_dissem.join(", ") }}
            </dd>
          </dl>
        </li>
        <li
          class="pb-2"
          v-if="document.wash_dissem && document.wash_dissem.length > 0"
        >
          <dl>
            <dt>Wash Dissem:</dt>
            <dd>
              {{ document.wash_dissem.join(", ") }}
            </dd>
          </dl>
        </li>
      </ul>
    </template>
  </DocumentExpansionPanel>
</template>

<script>
import DocumentExpansionPanel from "../document/DocumentExpansionPanel";
import documentMixin from "@shared/mixins/documentMixin";

export default {
  name: "DocumentAddressing",
  mixins: [documentMixin],
  components: { DocumentExpansionPanel },
};
</script>
