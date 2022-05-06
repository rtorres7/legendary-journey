<template>
  <div class="bg-mission-blue dark:bg-dark-space-blue energy:bg-gray-800">
    <div class="mx-auto px-4 flex justify-center lg:justify-between py-8">
      <div class="hidden lg:flex h-full items-center">
        <img class="h-14 w-14" src="@/assets/NCTCSealcolor.png" />
        <div
          class="
            ml-4
            uppercase
            text-xl text-white
            dark:text-slate-200
            energy:text-energy-yellow
            font-semibold
            tracking-[.25em]
          "
        >
          logo
        </div>
      </div>
      <ul
        class="
          flex
          self-center
          space-x-6
          text-sm text-slate-300
          energy:text-gray-300
        "
      >
        <li class="cursor-pointer hover:text-white">Contact Us</li>
        <li class="cursor-pointer hover:text-white">Help</li>
        <li class="cursor-pointer hover:text-white">About</li>
      </ul>
    </div>
    <div id="classification">
      <p
        class="
          text-center text-sm
          uppercase
          text-slate-300
          energy:text-gray-300
        "
      >
        Unclassified
      </p>
    </div>
  </div>
</template>
<style lang="scss">
/* Empty on Purpose */
</style>