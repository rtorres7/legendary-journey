<template>
  <label class="inline-flex text-sm font-medium"
    >{{ label }}
    <template v-if="required">
      <span class="sr-only">Required</span>
      <span class="pl-1 text-red-500">*</span>
    </template>
  </label>
  <div class="flex flex-col space-y-3">
    <div
      class="min-h-[2rem] max-w-fit mt-1 rounded shadow-md text-xs md:text-sm bg-white dark:bg-slate-600 energy:bg-zinc-900/30"
    >
      <label
        for="image-input"
        class="relative cursor-pointer focus-within:ring-2 font-medium"
      >
        <div
          class="px-2 md:px-4 py-2 dark:text-slate-300 energy:text-zinc-300 pt-2"
        >
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
    <!-- <span
      class="text-sm text-gray-600 dark:text-slate-400 energy:text-zinc-400 italic"
    >
      * Image must be square, minimum 300x300px</span
    > -->
    <div v-if="binary" class="flex flex-col">
      <img
        :src="getImgUrl(binary)"
        alt="thumbnail"
        class="max-h-[70px] max-w-[70px]"
      />
      <div v-if="uploadFile" class="flex items-center text-sm">
        <button
          type="button"
          class="w-8 h-8 flex items-center justify-center"
          tabindex="0"
          @click="removeProductImage"
        >
          <span class="sr-only">Remove Current Image</span>
          <XMarkIcon class="h-5 w-5" aria-hidden="true" />
        </button>
        <div class="line-clamp-1">
          <span class="font-medium">Current File: </span
          ><span
            class="ml-1 text-slate-900 dark:text-slate-400 energy:text-zinc-400"
            >{{ uploadFile.name }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";

export default {
  components: {
    XMarkIcon,
  },
  props: {
    binary: {
      type: String,
      required: true,
    },
    file: {
      type: File,
      default: null,
    },
    label: {
      type: String,
      default: "Image Attachment",
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["onImageAdded", "onImageRemoved"],
  setup(props, { emit }) {
    const uploadFile = ref(props.file);

    const changeImage = (event) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        emit("onImageAdded", {
          binary: reader.result,
          file: uploadFile.value,
        });
      });
      uploadFile.value = event.target.files[0];
      reader.readAsDataURL(uploadFile.value);
      event.target.value = null;
    };

    const removeProductImage = () => {
      uploadFile.value = null;
      emit("onImageRemoved");
    };

    const getImgUrl = (link) => {
      if (import.meta.env.MODE === "offline") {
        return new URL(
          "@/shared/assets/ukraine_flag_70x70.png",
          import.meta.url
        ).href;
      }
      return link;
    };

    return {
      changeImage,
      removeProductImage,
      uploadFile,
      close,
      getImgUrl,
    };
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
