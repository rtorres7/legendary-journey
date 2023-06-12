<template>
  <component :is="tag" class="file-preview">
    <div class="flex space-x-4 ml-4 pt-4">
      <template v-if="file.status == true">
        <PhotoIcon
          v-if="file.file.type.includes('image/')"
          class="h-6 w-6 self-top text-slate-500 dark:text-slate-400 energy:text-zinc-400"
        />
        <DocumentIcon
          v-else
          class="h-6 w-6 self-top text-slate-500 dark:text-slate-400 energy:text-zinc-400"
        />
      </template>
      <template v-else-if="file.status == false">
        <div>
          <tippy content="Remove" :delay="[500, null]">
            <button
              class="object-top"
              :aria-label="`remove failed upload ${file.file.name} `"
            >
              <XMarkIcon
                class="h-5 w-5 hover:cursor-pointer hover:text-slate-700 dark:hover:text-slate-100 energy:hover:text-zinc-100"
                @click="$emit('remove', file)"
              />
            </button>
          </tippy>
        </div>
      </template>
      <div
        class="flex flex-col gap-y-2 pb-4 w-full xl:w-3/4 border-b border-slate-900/10 dark:border-slate-700/75 energy:border-zinc-700/75"
      >
        <div class="flex justify-between text-sm">
          <p class="font-medium">{{ file.file.name }}</p>
          <p v-show="file.status == true">
            {{ fileSizeInKb(file.file.size) }} KB
          </p>
        </div>
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
          <p v-show="file.status == true">
            {{ dayjs().format("DD MMM YYYY") }}
          </p>
          <div class="flex space-x-2">
            <span v-show="file.status == true">
              <tippy content="Download" :delay="[500, null]">
                <router-link
                  :to="'' + file.wire_url + file.dbId"
                  target="_blank"
                  :aria-label="`download ${file.file.name}`"
                >
                  <ArrowDownTrayIcon
                    class="h-5 w-5 hover:text-slate-700 dark:hover:text-slate-100 energy:hover:text-zinc-100"
                    title="Download"
                  />
                </router-link>
              </tippy>
            </span>
            <span v-show="file.status == true">
              <tippy content="Delete" :delay="[500, null]">
                <router-link
                  to=""
                  :aria-label="`delete ${file.file.name}`"
                  @click.prevent="deleteItem(file)"
                >
                  <TrashIcon
                    class="h-5 w-5 hover:text-slate-700 dark:hover:text-slate-100 energy:hover:text-zinc-100"
                    title="Delete"
                  />
                </router-link>
              </tippy>
            </span>
          </div>
        </div>
      </div>
    </div>
  </component>
</template>
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
    const deleteItem = (file) => {
      fetch(file.wire_url + file.dbId, { method: "DELETE" })
        .then((response) => {
          console.log("deleteItem response: ", response);
          this.$emit("remove", file);
        })
        .catch(console.log("Failed"));
    };

    const fileSizeInKb = (fileSize) => {
      const kb = parseFloat(fileSize) * 0.001;
      return Math.round(kb);
    };

    return {
      deleteItem,
      fileSizeInKb,
      dayjs,
    };
  },
};
</script>
<style scoped lang="scss">
.file-preview {
  width: 100%;
  height: 20%;
  position: relative;

  img {
    width: 10%;
    height: 10%;
    display: block;
    object-fit: cover;
  }
}

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
