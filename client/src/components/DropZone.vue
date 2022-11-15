<template>
  <div
    :data-active="active"
    @dragenter.prevent="setActive"
    @dragover.prevent="setActive"
    @dragleave.prevent="setInactive"
    @drop.prevent="onDrop"
  >
    <slot :dropZoneActive="active"></slot>
  </div>
</template>
<script>
import { ref, onMounted, onUnmounted } from "vue";
export default {
  emits: ["files-dropped"],
  setup(props, { emit }) {
    const active = ref(false);
    let inActiveTimeout = null;
    // setActive and setInactive are timeouts, so that when drag an item over a child element,
    // the dragleave event that is fired won't cause a flicker. A few ms should be plenty of
    // time to wait for the next dragenter event to clear the timeout and set it back to active.
    const setActive = () => {
      active.value = true;
      clearTimeout(inActiveTimeout);
    };

    const setInactive = () => {
      inActiveTimeout = setTimeout(() => {
        active.value = false;
      }, 50);
    };

    const onDrop = (e) => {
      setInactive();
      emit("files-dropped", [...e.dataTransfer.files]);
    };

    const preventDefaults = (e) => {
      e.preventDefault();
    };

    const events = ["dragenter", "dragover", "dragleave", "drop"];

    onMounted(() => {
      events.forEach((eventName) => {
        document.body.addEventListener(eventName, preventDefaults);
      });
    });
    onUnmounted(() => {
      events.forEach((eventName) => {
        document.body.removeEventListener(eventName, preventDefaults);
      });
    });

    return {
      active,
      setActive,
      setInactive,
      onDrop,
    };
  },
};
