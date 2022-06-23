<template>
  <div class="pr-4 lg:pr-0">
    <BaseCard
      :locked="threat.locked"
      class="w-[275px] lg:w-full hover:underline rounded-lg shadow-md"
      :class="carousel === true ? 'h-36' : ''"
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
    </BaseCard>
  </div>
</template>
<script>
import { LockClosedIcon } from "@heroicons/vue/outline";
import BaseCard from "@/components/base/BaseCard";

export default {
  components: {
    LockClosedIcon,
    BaseCard,
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
