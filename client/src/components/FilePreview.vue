<template>
  <component :is="tag" class="file-preview">
    <div class="flex space-x-4">
      <template v-if="file.status == true">
        <PhotoIcon
          v-if="file.file.type.includes('image/')"
          class="h-8 w-8 self-top text-slate-500 dark:text-slate-400 energy:text-zinc-400"
        />
        <DocumentIcon
          v-else
          class="h-8 w-8 self-top text-slate-500 dark:text-slate-400 energy:text-zinc-400"
        />
      </template>
      <template v-else-if="file.status == false">
        <div>
          <button class="object-top">
            <XMarkIcon
              class="h-5 w-5 hover:cursor-pointer text-red-500"
              @click="$emit('remove', file)"
            />
          </button>
        </div>
      </template>
      <div
        class="flex flex-col gap-y-2 pb-4 w-3/4 border-b border-slate-900/10 dark:border-slate-700/75 energy:border-zinc-700/75"
      >
        <div class="flex justify-between text-sm">
          <p class="font-medium">{{ file.file.name }}</p>
          <p>{{ fileSizeInKb(file.file.size) }} KB</p>
        </div>
        <!-- </div> -->
        <div>
          <span>
            <div class="meter">
              <span
                :class="
                  file.status == 'loading' || file.status == true
                    ? 'progress'
                    : 'failure'
                "
              ></span>
            </div>
          </span>
        </div>
        <div class="flex justify-between text-sm">
          <p>{{ dayjs().format("YYYY-MM-DD, H:mm") }}</p>
          <p>USER</p>
          <div class="flex space-x-2">
            <span v-show="file.status == true">
              <router-link :to="'' + file.wire_url + file.dbId" target="_blank">
                <ArrowDownTrayIcon class="h-5 w-5" title="Download" />
              </router-link>
            </span>
            <span v-show="file.status == true">
              <router-link to="" @click.prevent="deleteItem(file)">
                <TrashIcon class="h-5 w-5" title="Delete" />
              </router-link>
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- <button
        v-if="!file.status"
        class="close-icon shrink-0"
        @click="$emit('remove', file)"
      >
        &times;
      </button>
      <span>{{ file.file.name }}</span>
      <span v-show="file.status == true">
        <router-link :to="'' + file.wire_url + file.dbId" target="_blank">
          <DocumentArrowDownIcon class="h5 w-5" title="Download" />
        </router-link>
      </span>
      <span v-show="file.status == true">
        <router-link to="" @click.prevent="deleteItem(file)">
          <DocumentMinusIcon class="h-5 w-5" title="Download" />
        </router-link>
      </span>
      <span
        v-show="file.status == 'loading'"
        class="status-indicator loading-indicator"
        >In Progress</span
      >
      <span
        v-show="file.status == true"
        class="status-indicator success-indicator"
        >Uploaded</span
      >
      <span
        v-show="file.status == false"
        class="status-indicator failure-indicator"
        >Error</span
      >
    </div> -->
  </component>
</template>
<script setup>
defineProps({
  file: { type: Object, required: true },
  tag: { type: String, default: "li" },
});
defineEmits(["remove"]);
</script>
<script>
import {
  ArrowDownTrayIcon,
  TrashIcon,
  XMarkIcon,
  PhotoIcon,
  DocumentIcon,
} from "@heroicons/vue/24/outline";
import * as dayjs from "dayjs";

export default {
  components: {
    ArrowDownTrayIcon,
    TrashIcon,
    XMarkIcon,
    PhotoIcon,
    DocumentIcon,
    dayjs,
  },
  setup() {},
  methods: {
    deleteItem(file) {
      fetch(file.wire_url + file.dbId, { method: "DELETE" })
        .then((response) => {
          console.log("deleteItem response: ", response);
          this.$emit("remove", file);
        })
        .catch(console.log("Failed"));
    },

    fileSizeInKb(fileSize) {
      const kb = parseFloat(fileSize) * 0.001;
      return Math.round(kb);
    },
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

// @keyframes pulse {
//   0% {
//     background: #fff;
//   }

//   50% {
//     background: #ddd;
//   }

//   100% {
//     background: #fff;
//   }
// }

//new stuff
.meter {
  height: 5px;
  position: relative;
  background: #f3efe6;
  overflow: hidden;
}

.meter span {
  display: block;
  height: 100%;
}

.progress {
  @apply bg-green-500;
  animation: progressBar 3s ease-in-out;
  animation-fill-mode: both;
  -moz-animation: progressBar 3s ease-in-out;
  -moz-animation-fill-mode: both;
}

.failure {
  @apply bg-red-500;
  animation: progressBar 1s ease-in-out;
  animation-fill-mode: both;
  -moz-animation: progressBar 1s ease-in-out;
  -moz-animation-fill-mode: both;
}

@keyframes progressBar {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}

@-moz-keyframes progressBar {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}
</style>
