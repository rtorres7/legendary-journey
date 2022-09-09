<template> 
    <div class="group relative">
        <span
            class="
                absolute 
                hidden 
                group-hover:flex 
                -top-2  
                w-28 
                px-2 py-2
                bg-slate-200
                dark:bg-slate-300
                energy:bg-zinc-300
                rounded-lg 
                font-normal
                text-center text-sm 
                text-black
            "
            :class="
                placement === 'top'
                ? '-left-2 -translate-y-full after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-slate-200 dark:after:border-t-slate-300 energy:after:border-t-zinc-300'
                : 'mt-2 -left-3 -translate-x-full before:absolute before:top-1/2  before:left-[100%] before:-translate-y-1/2 before:border-8 before:border-y-transparent before:border-r-transparent before:border-l-slate-200 dark:before:border-l-slate-300 energy:before:border-l-zinc-300'
            "
        >
            Coming Soon
        </span>
        <slot />
    </div>
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