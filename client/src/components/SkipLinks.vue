<template>
    <div>
        <router-link to="main" @click="skipToMain"  class="skipLink">Skip to main content</router-link>
    </div>
</template>

<script>
export default {
    name: "SkipLinks",
    props: ["targets"],
    methods: {
        skipToMain() {
            this.targets.skipLink.focus();
        }
    }
}
</script>

<style scoped lang="scss">
.skip-link{
    &:link,
    &:visited {
        color: blue;
    }
    position: absolute;
    left: -9999px;
    top: 20px;
    z-index: 1000;
    &:active, 
    &:focus {
        background: red;
        left: 20px;
    }
}
</style>