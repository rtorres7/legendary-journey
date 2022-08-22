<template>
  <div>
    <div
      class="
        flex flex-col 
        gap-y-4
        py-4
        border-b-2 border-slate-900/10
        dark:border-slate-50/[0.06]
        energy:border-gray-700/25
      "
    >
      <p class="font-semibold text-2xl">
        Publish an Article
      </p>
      <p>
        Get started by selecting from the following options.
      </p>
    </div>
    <div class="
        flex flex-col 
        gap-y-4
        py-8
        border-b-2 border-slate-900/10
        dark:border-slate-50/[0.06]
        energy:border-gray-700/25
      "
    >
      <p class="font-semibold">
        Template Upload
      </p>
      <label class="sr-only" for="dropzoneFile">Upload a file to publish</label>
      <PublishFileUploader @drop.prevent="drop()" @change="selectedFile()" class="md:w-1/2">
        <button @click.prevent="fileInputButton.click()"
          class="
            bg-slate-100 hover:bg-slate-200/80 
            dark:bg-slate-700 dark:hover:bg-slate-700/80 
            energy:bg-gray-700 energy:hover:bg-gray-700/80 border 
            border-slate-300 
            p-2 
            rounded shadow
            text-sm
          "
        >
          Select File
        </button>
        <input type="file" id="dropzoneFile" class="dropzoneFile hidden" ref="fileInputButton" />
      </PublishFileUploader>
    </div>
    <div class="py-8"> 
      <div class="flex gap-x-2 items-center">
        <router-link
          to="/article/new"
          class="font-semibold"
        >
          Create a New Article
        </router-link>
        <ArrowRightIcon class="h-5 w-5" />
      </div>
      <p class="text-sm">
        Starting from scratch? Start here.
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import PublishFileUploader from "@/components/PublishFileUploader";
import { ArrowRightIcon } from "@heroicons/vue/outline";
import { useRouter } from "vue-router";

export default {
  name: "PublishArticleView",
  components: {
    PublishFileUploader,
    ArrowRightIcon,
  },

  setup() {
    const router = useRouter();
    const fileInputButton = ref(null);
    const dropzoneFile = ref("");
    
    const drop = (event) => {
      router.push({ name: 'edit', params: {id: "BBK303597595551226"}});
      dropzoneFile.value = event.dataTransfer.files[0];
    };
    const selectedFile = () => {
      router.push({ name: 'edit', params: {id: "BBK303597595551226"}});
      dropzoneFile.value = document.querySelector(".dropzoneFile").files[0];
    };

    return {
      fileInputButton,
      dropzoneFile,
      drop,
      selectedFile,
    };
  }
} 
</script>

<style scoped lang="scss"></style>
