<template> 
    <button class="group relative inline-block">
        <span
            class="
                absolute 
                hidden 
                group-hover:flex 
                -top-2  
                w-48 
                px-2 py-1 
                bg-mission-blue/95
                dark:bg-dark-space-blue/95
                energy:bg-zinc-700
                rounded-lg 
                text-center text-sm 
                text-slate-200
                dark:text-slate-300
                energy:text-zinc-300
               
            "
            :class="
                placement === 'top'
                ? '-left-20 -translate-y-full after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-white dark:after:border-t-dark-space-blue energy:after:border-t-zinc-700'
                : '-right-3 translate-x-full before:absolute before:top-1/2  before:right-[100%] before:-translate-y-1/2 before:border-8 before:border-y-transparent before:border-l-transparent before:border-r-mission-blue/95 dark:before:border-r-dark-space-blue/95 energy:before:border-r-zinc-700'
            "
        >
            Feature coming soon
        </span>
        <slot />
    </button>
</template>

<script>
export default {
    components: {},
    props: {
        placement: {
            type: String,
            default: "top",
        },
    },
    setup() {

    },
};
</script>

<style scoped lang="scss">

</style>