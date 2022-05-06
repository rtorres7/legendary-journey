<template>
  <div class="pr-4 lg:pr-0">
    <div
      class="w-[275px] lg:w-full hover:underline rounded-lg shadow-md"
      :class="[
        threat.locked
          ? 'bg-slate-200 hover:bg-slate-300/80 dark:bg-slate-700 dark:hover:bg-slate-700/80 energy:bg-gray-700 energy:hover:bg-gray-700/80'
          : 'cursor-pointer bg-slate-50 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 energy:bg-gray-800 energy:hover:bg-gray-700/80',
        carousel === true ? 'h-36' : '',
      ]"
    >
      <div class="h-36 p-4 flex flex-col justify-between text-sm text-left">
        <div class="pb-2">
          <template v-if="threat.locked">
            <div class="flex items-center font-semibold pb-1">
              <LockClosedIcon
                class="mr-2 h-4 w-4"
                aria-hidden="true"
              ></LockClosedIcon
              >Locked
            </div>
          </template>
          <div class="line-clamp-3">
            {{ threat.title }}
          </div>
        </div>
        <p
          class="text-slate-600 dark:text-slate-300/80 energy:text-slate-300/80"
        >
          {{ threat.date }}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { LockClosedIcon } from "@heroicons/vue/outline";
export default {
  components: {
    LockClosedIcon,
  },
  props: {
    carousel: {
      default: false,
      type: Boolean,
    },
    threat: Object,
  },
};
</script>
