<template>
  <component :is="tag" class="file-preview">
    <div class="flex space-x-2">
      <button v-if="!file.status" class="close-icon shrink-0" @click="$emit('remove', file)">
        &times;
      </button>
      <span>{{ file.file.name }}</span>
      <span v-show="file.status == true">
        <router-link :to="''+file.wire_url+file.dbId" target="_blank">
          <DocumentDownloadIcon class="h5 w-5" title="Download" />
        </router-link> 
      </span>
      <span v-show="file.status == true">
        <router-link to="" @click.prevent="deleteItem(file)">
          <DocumentRemoveIcon class="h-5 w-5" title="Download" />
        </router-link>
      </span>
      <span v-show="file.status == 'loading'" class="status-indicator loading-indicator">In Progress</span>
      <span v-show="file.status == true" class="status-indicator success-indicator">Uploaded</span>
      <span v-show="file.status == false" class="status-indicator failure-indicator">Error</span>
    </div>
  </component>
</template>
<script setup>
defineProps({
  file: { type: Object, required: true },
  tag: { type: String, default: 'li' }
})
defineEmits(['remove'])
</script>
<script>
import { DocumentDownloadIcon, DocumentRemoveIcon } from "@heroicons/vue/solid"

export default {
  components: {
    DocumentDownloadIcon,
    DocumentRemoveIcon
  },
  setup() {

  },
  methods: {
    deleteItem(file) {
      fetch(file.wire_url + file.dbId, { method: 'DELETE'}).then(response => {
        console.log('deleteItem response: ', response)
        this.$emit('remove', file)
      }).catch(console.log('Failed'))
    }
  }
}
</script>
<style scoped lang="scss">
.file-preview {
  width: 100%;
  height: 20%;
  margin: 1rem 2.5%;
  position: relative;

  // aspect-ratio: 1/1;
  // overflow: hidden
  img {
    width: 10%;
    height: 10%;
    display: block;
    object-fit: cover;
  }

  .close-icon .status-indicator {
    --size: 20px;
    position: relative;
    line-height: var(--size);
    height: var(--size);
    border-radius: var(--size);
    box-shadow: 0 0 5px currentColor;
    right: 0.25rem;
    appearance: none;
    border: 0;
    padding: 0;
  }

  .close-icon {
    width: var(--size);
    font-size: var(--size);
    background: #933;
    color: #fff;
    top: 0.25rem;
    cursor: pointer;
  }

  .status-indicator {
    font-size: calc(0.6 * var(--size));
    bottom: 0.25rem;
    padding: 0;
  }

  .loading-indicator {
    animation: pulse 1.5s linear 0s infinite;
    color: #000;
  }

  .success-indicator {
    background: #6c6;
    color: #040;
  }

  .failure-indicator {
    background: #933;
    color: #fff;
  }
}

@keyframes pulse {
  0% {
    background: #fff;
  }

  50% {
    background: #ddd;
  }

  100% {
    background: #fff;
  }
}
</style>

