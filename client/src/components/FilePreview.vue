<template>
  <component :is="tag" class="file-preview">
    <div class="flex space-x-2">
      <button @click="$emit('remove', file)" class="close-icon shrink-0">
        &times;
      </button>
      <img :src="file.url" :alt="file.file.name" :title="file.file.name" />
      --
      <span
        class="status-indicator loading-indicator"
        v-show="file.status == 'loading'"
        >In Progress</span
      >
      <span
        class="status-indicator success-indicator"
        v-show="file.status == true"
        >Uplaoded</span
      >
      <span
        class="status-indicator failure-indicator"
        v-show="file.status == false"
        >Error</span
      >
    </div>
  </component>
</template>
<script>
export default {
  props: {
    file: {
      type: Object,
      required: true,
    },
    tag: {
      type: String,
      default: "li",
    },
  },
  emits: ["remove"],
  setup() {
    return {};
  },
};
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
    font-size: calc(0.6 * var (--size));
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

