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
      <h1 class="font-semibold text-2xl">
        Publish an Article
      </h1>
      <h2>
        Get started by selecting from the following options.
      </h2>
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
      <h3 class="font-semibold">
        Template Upload
      </h3>
      <label class="sr-only" for="fileUpload">Upload a file to publish</label>
      <PublishFileUploader @drop.prevent="drop" @change="selectedFile" ref="fileUpload" class="md:w-1/2" />
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
    let fileUpload = ref("");
    
    const drop = (event) => {
      fileUpload.value = event.dataTransfer.files[0];
      if ( /\.(doc|docx)$/i.test(fileUpload.value.name) === false ) { 
        alert("File must be of type .doc or .docx"); 
      } else { 
        router.push({ name: 'edit', params: {id: "BBK303597595551226"}}); 
      }
    };

    const selectedFile = () => {
      var file = document.querySelector(".fileUpload");
      if (file) {
        if ( /\.(doc|docx)$/i.test(file.files[0].name) === false ) { 
          alert("File must be of type .doc or .docx"); 
        } else { 
          router.push({ name: 'edit', params: {id: "BBK303597595551226"}}); 
        }
      }
    };

    return {
      fileUpload,
      drop,
      selectedFile,
    };
  }
} 
</script>

<style scoped lang="scss"></style>
