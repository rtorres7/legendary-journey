
<template>
  <label class="text-sm font-medium">{{ label }}</label>
  <div class="flex flex-col space-y-3">
    <div
      class="
        min-h-[2rem]
        max-w-fit
        mt-1
        rounded
        shadow-md
        text-xs
        md:text-sm
        bg-white
        dark:bg-dark-navy/30
        energy:bg-zinc-900/30
      "
    >
      <label
        for="image-input"
        class="relative cursor-pointer focus-within:ring-2 font-medium"
      >
        <div class="px-2 md:px-4 py-2 dark:text-slate-300 energy:text-zinc-300">
          Choose File
        </div>
        <input
          id="image-input"
          name="image-input"
          type="file"
          class="sr-only"
          accept="image/jpeg, image/png, image/jpg"
          @change="changeImage"
        />
      </label>
    </div>
    <div v-if="binary" class="flex flex-col">
      <img
        :src="getImgUrl(binary)"
        alt="thumbnail"
        class="max-h-[70px] max-w-[70px]"
      />
      <div v-show="uploadFileName" class="flex items-center text-sm">
        <button
          type="button"
          class="w-8 h-8 flex items-center justify-center"
          tabindex="0"
          @click="removeArticleImage"
        >
          <span class="sr-only">Remove Current Image</span
          ><XIcon class="h-5 w-5" aria-hidden="true" />
        </button>
        <div class="line-clamp-1">
          <span class="font-medium">Current File: </span
          ><span
            class="ml-1 text-slate-900 dark:text-slate-400 energy:text-zinc-400"
            >{{ uploadFileName }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { XIcon } from "@heroicons/vue/outline";

export default {
  components: {
    XIcon,
  },
  props: {
    binary: {
      type: String,
    },
    label: {
      type: String,
      default: "Image Attachment",
    },
  },
  emits: ["onImageAdded", "onImageRemoved"],
  setup(props, { emit }) {
    const uploadFileName = ref(null);

    const changeImage = (event) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        emit("onImageAdded", reader.result);
      });
      uploadFileName.value = event.target.files[0].name;
      reader.readAsDataURL(event.target.files[0]);
      event.target.value = null;
    };

    const removeArticleImage = () => {
      uploadFileName.value = null;
      emit("onImageRemoved");
    };

    const getImgUrl = (link) => {
      if (process.env.NODE_ENV === "low") {
        return require("@/assets/ukraine_flag_70x70.png");
      }
      return link;
    };

    return {
      changeImage,
      removeArticleImage,
      uploadFileName,
      close,
      getImgUrl,
    };
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
